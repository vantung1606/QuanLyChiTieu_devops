package com.example.demo.service;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
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

        boolean hasType = type != null && !type.isEmpty();
        boolean hasCategory = category != null && !category.isEmpty();
        boolean hasDate = startDate != null;

        if (hasType && hasCategory && hasDate) {
            transactions = transactionRepository.findByUserAndTypeAndCategoryAndDateAfterOrderByDateDesc(user, type, category, startDate);
        } else if (hasType && hasCategory) {
            transactions = transactionRepository.findByUserAndTypeAndCategoryOrderByDateDesc(user, type, category);
        } else if (hasType && hasDate) {
            transactions = transactionRepository.findByUserAndTypeAndDateAfterOrderByDateDesc(user, type, startDate);
        } else if (hasCategory && hasDate) {
            transactions = transactionRepository.findByUserAndCategoryAndDateAfterOrderByDateDesc(user, category, startDate);
        } else if (hasType) {
            transactions = transactionRepository.findByUserAndTypeOrderByDateDesc(user, type);
        } else if (hasCategory) {
            transactions = transactionRepository.findByUserAndCategoryOrderByDateDesc(user, category);
        } else if (hasDate) {
            transactions = transactionRepository.findByUserAndDateAfterOrderByDateDesc(user, startDate);
        } else {
            transactions = transactionRepository.findByUserOrderByDateDesc(user);
        }

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> searchTransactions(String query) {
        User user = getCurrentUser();
        return transactionRepository.findByUserAndTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrderByDateDesc(user, query, query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO createTransaction(TransactionDTO dto) {
        User user = getCurrentUser();
        Transaction transaction = convertToEntity(dto);
        transaction.setUser(user);
        return convertToDTO(transactionRepository.save(transaction));
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

    public String exportTransactionsToCsv() {
        List<TransactionDTO> transactions = getAllTransactions();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Date,Title,Category,Type,Amount\n");
        
        for (TransactionDTO t : transactions) {
            csv.append(t.getId()).append(",")
               .append(t.getDate()).append(",")
               .append("\"").append(t.getTitle().replace("\"", "\"\"")).append("\",")
               .append("\"").append(t.getCategory().replace("\"", "\"\"")).append("\",")
               .append(t.getType()).append(",")
               .append(t.getAmount()).append("\n");
        }
        
        return csv.toString();
    }

    public Map<String, Double> getSummary() {
        User user = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUser(user);
        
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
