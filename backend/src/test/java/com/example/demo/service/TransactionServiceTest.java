package com.example.demo.service;

import com.example.demo.dto.TransactionDTO;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");

        SecurityContextHolder.setContext(securityContext);
    }

    private void mockSecurityContext(String username) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
    }

    @Test
    void createTransaction_ShouldSaveAndReturnDTO() {
        mockSecurityContext("testuser");
        TransactionDTO dto = TransactionDTO.builder()
                .title("Lunch")
                .amount(50.0)
                .type("expense")
                .category("Food")
                .build();

        Transaction savedEntity = new Transaction();
        savedEntity.setId(1L);
        savedEntity.setTitle("Lunch");
        savedEntity.setAmount(50.0);
        savedEntity.setType("expense");
        savedEntity.setCategory("Food");
        savedEntity.setUser(mockUser);

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedEntity);

        TransactionDTO result = transactionService.createTransaction(dto);

        assertNotNull(result.getId());
        assertEquals("Lunch", result.getTitle());
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void getFilteredTransactions_ShouldCallRepositoryWithCorrectParams() {
        mockSecurityContext("testuser");
        when(transactionRepository.findFilteredTransactionsWithKeyword(anyLong(), any(), any(), any(), any()))
                .thenReturn(Collections.emptyList());

        transactionService.getFilteredTransactions("expense", "Food", 7, null);

        verify(transactionRepository).findFilteredTransactionsWithKeyword(eq(mockUser.getId()), eq("expense"), eq("Food"), any(), any());
    }

    @Test
    void getSummary_ShouldCalculateCorrectTotals() {
        mockSecurityContext("testuser");
        Transaction t1 = new Transaction();
        t1.setType("income");
        t1.setAmount(100.0);

        Transaction t2 = new Transaction();
        t2.setType("expense");
        t2.setAmount(30.0);

        when(transactionRepository.findByUserOrderByDateDesc(mockUser)).thenReturn(List.of(t1, t2));

        Map<String, Double> summary = transactionService.getSummary();

        assertEquals(100.0, summary.get("totalIncome"));
        assertEquals(30.0, summary.get("totalExpense"));
        assertEquals(70.0, summary.get("balance"));
    }

    @Test
    void deleteTransaction_ShouldDeleteIfOwnedByUser() {
        mockSecurityContext("testuser");
        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setUser(mockUser);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        transactionService.deleteTransaction(1L);

        verify(transactionRepository).delete(transaction);
    }

    @Test
    void deleteTransaction_ShouldThrowExceptionIfNotOwnedByUser() {
        mockSecurityContext("testuser");
        User otherUser = new User();
        otherUser.setId(2L);

        Transaction transaction = new Transaction();
        transaction.setId(1L);
        transaction.setUser(otherUser);

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        assertThrows(RuntimeException.class, () -> transactionService.deleteTransaction(1L));
        verify(transactionRepository, never()).delete(any());
    }
}
