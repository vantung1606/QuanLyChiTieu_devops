package com.example.demo.repository;

import com.example.demo.entity.RecurringTransaction;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {
    List<RecurringTransaction> findByUser(User user);
    List<RecurringTransaction> findByNextExecutionDateBeforeAndIsActiveTrue(LocalDateTime date);
    void deleteByUser(User user);
}
