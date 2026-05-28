package com.example.demo.repository;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDateTime start, LocalDateTime end);

    void deleteByUser(User user);
    void deleteByCategoryAndUser(String category, User user);
}
