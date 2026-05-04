package com.example.demo.service;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.entity.Transaction;
import com.example.demo.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> searchTransactions(String query) {
        return transactionRepository.findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrderByDateDesc(query, query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO createTransaction(TransactionDTO dto) {
        Transaction transaction = convertToEntity(dto);
        return convertToDTO(transactionRepository.save(transaction));
    }

    public TransactionDTO updateTransaction(Long id, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found for id: " + id));

        transaction.setTitle(dto.getTitle());
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());

        return convertToDTO(transactionRepository.save(transaction));
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found for id: " + id));
        transactionRepository.delete(transaction);
    }

    public Map<String, Double> getSummary() {
        List<Transaction> transactions = transactionRepository.findAll();
        
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

