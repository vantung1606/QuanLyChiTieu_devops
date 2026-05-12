package com.example.demo.service;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CategoryRepository categoryRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<TransactionDTO> getAllTransactions() {
        return getFilteredTransactions(null, null, null);
    }

    public List<TransactionDTO> getFilteredTransactions(String type, String category, Integer days) {
        User user = getCurrentUser();
        List<Transaction> transactions;
        
        java.time.LocalDateTime startDate = null;
        if (days != null && days > 0) {
            startDate = java.time.LocalDateTime.now().minusDays(days);
        }

        String cleanType = (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("null") && !type.equalsIgnoreCase("undefined")) ? type.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("null") && !category.equalsIgnoreCase("undefined")) ? category.trim() : null;

        return transactionRepository.findFilteredTransactions(user.getId(), cleanType, cleanCategory, startDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> searchTransactions(String query) {
        User user = getCurrentUser();
        return transactionRepository.searchTransactions(user.getId(), query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO createTransaction(TransactionDTO dto) {
        User user = getCurrentUser();
        Transaction transaction = convertToEntity(dto);
        transaction.setUser(user);
        Transaction saved = transactionRepository.save(transaction);
        
        // Cảnh báo hạn mức sau khi lưu
        if ("expense".equalsIgnoreCase(saved.getType())) {
            checkBudget(saved);
        }
        
        return convertToDTO(saved);
    }

    private void checkBudget(Transaction transaction) {
        User user = transaction.getUser();
        categoryRepository.findByNameAndUser(transaction.getCategory(), user).ifPresent(category -> {
            if (category.getBudget() > 0) {
                java.time.LocalDateTime startOfMonth = java.time.LocalDateTime.now()
                        .with(java.time.temporal.TemporalAdjusters.firstDayOfMonth())
                        .withHour(0).withMinute(0).withSecond(0);
                
                double totalSpent = transactionRepository.findFilteredTransactions(
                        user.getId(), "expense", category.getName(), startOfMonth)
                        .stream()
                        .mapToDouble(Transaction::getAmount)
                        .sum();
                
                double budget = category.getBudget();
                
                if (totalSpent >= budget) {
                    notificationService.createNotification(
                        user,
                        "BÁO ĐỘNG: Vượt hạn mức " + category.getName(),
                        "Bạn đã chi tiêu " + String.format("%,.0f", totalSpent) + " VNĐ, chính thức VƯỢT hạn mức " + 
                        String.format("%,.0f", budget) + " VNĐ.",
                        "BUDGET_EXCEEDED"
                    );
                } else if (totalSpent >= budget * 0.8) {
                    notificationService.createNotification(
                        user,
                        "CẢNH BÁO: Sắp hết hạn mức " + category.getName(),
                        "Bạn đã chi tiêu " + String.format("%,.0f", totalSpent) + " VNĐ, chạm mốc 80% hạn mức (" + 
                        String.format("%,.0f", budget) + " VNĐ). Hãy cân đối lại nhé!",
                        "BUDGET_WARNING"
                    );
                }
            }
        });
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO dto) {
        User user = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found for id: " + id));

        // Security check
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this transaction");
        }

        transaction.setTitle(dto.getTitle());
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());

        return convertToDTO(transactionRepository.save(transaction));
    }

    public void deleteTransaction(Long id) {
        User user = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found for id: " + id));

        // Security check
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public String exportTransactionsToCsv(String type, String category, Integer days) {
        List<TransactionDTO> transactions = getFilteredTransactions(type, category, days);
        StringBuilder csv = new StringBuilder();
        csv.append("Date,Title,Category,Type,Amount\n");
        for (TransactionDTO t : transactions) {
            csv.append(t.getDate().toLocalDate()).append(",")
               .append("\"").append(t.getTitle().replace("\"", "\"\"")).append("\",")
               .append("\"").append(t.getCategory().replace("\"", "\"\"")).append("\",")
               .append(t.getType()).append(",")
               .append(t.getAmount()).append("\n");
        }
        return csv.toString();
    }

    public Map<String, Double> getSummary() {
        User user = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
        
        double totalIncome = transactions.stream()
                .filter(t -> "income".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        double totalExpense = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        Map<String, Double> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("balance", totalIncome - totalExpense);
        
        return summary;
    }

    private TransactionDTO convertToDTO(Transaction entity) {
        return TransactionDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .amount(entity.getAmount())
                .type(entity.getType())
                .category(entity.getCategory())
                .date(entity.getDate())
                .build();
    }

    private Transaction convertToEntity(TransactionDTO dto) {
        return Transaction.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .type(dto.getType())
                .category(dto.getCategory())
                .date(dto.getDate())
                .build();
    }
}
