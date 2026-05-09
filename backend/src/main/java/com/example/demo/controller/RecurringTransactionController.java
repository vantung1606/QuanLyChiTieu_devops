package com.example.demo.controller;

import com.example.demo.entity.RecurringTransaction;
import com.example.demo.service.RecurringTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring")
@RequiredArgsConstructor
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    @GetMapping
    public ResponseEntity<List<RecurringTransaction>> getAll() {
        return ResponseEntity.ok(recurringTransactionService.getAllRecurringTransactions());
    }

    @PostMapping
    public ResponseEntity<RecurringTransaction> create(@RequestBody RecurringTransaction recurring) {
        return ResponseEntity.ok(recurringTransactionService.createRecurring(recurring));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recurringTransactionService.deleteRecurring(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/process")
    public ResponseEntity<String> forceProcess() {
        recurringTransactionService.processRecurringTransactions();
        return ResponseEntity.ok("Processing triggered manually");
    }
}
