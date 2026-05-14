package com.example.demo.controller;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions(
            @RequestParam(required = false) String type, 
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer days,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(transactionService.getFilteredTransactions(type, category, days, keyword));
    }

    @PostMapping("/transactions")
    public ResponseEntity<TransactionDTO> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        return ResponseEntity.ok(transactionService.createTransaction(transactionDTO));
    }
 
     @DeleteMapping("/transactions/{id}")
     public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
         transactionService.deleteTransaction(id);
         return ResponseEntity.ok().build();
     }

     @PutMapping("/transactions/{id}")
     public ResponseEntity<TransactionDTO> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionDTO transactionDTO) {
         return ResponseEntity.ok(transactionService.updateTransaction(id, transactionDTO));
     }
 
     @GetMapping("/summary")
     public ResponseEntity<Map<String, Double>> getSummary() {
         return ResponseEntity.ok(transactionService.getSummary());
    }

     @GetMapping("/transactions/export")
    public ResponseEntity<String> exportTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer days) {
        String csv = transactionService.exportTransactionsToCsv(type, category, days);
         return ResponseEntity.ok()
                 .header("Content-Type", "text/csv; charset=UTF-8")
                 .header("Content-Disposition", "attachment; filename=transactions.csv")
                 .body(csv);
     }
}
