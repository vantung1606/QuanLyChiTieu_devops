package com.example.demo.repository;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    List<Transaction> findByUserAndTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrderByDateDesc(User user, String title, String category);
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetweenOrderByDateAsc(User user, java.time.LocalDateTime start, java.time.LocalDateTime end);
    List<Transaction> findByUserAndCategoryOrderByDateDesc(User user, String category);
    List<Transaction> findByUserAndDateAfterOrderByDateDesc(User user, java.time.LocalDateTime date);
    List<Transaction> findByUserAndCategoryAndDateAfterOrderByDateDesc(User user, String category, java.time.LocalDateTime date);
    List<Transaction> findByUserAndTypeOrderByDateDesc(User user, String type);
    List<Transaction> findByUserAndTypeAndCategoryOrderByDateDesc(User user, String type, String category);
    List<Transaction> findByUserAndTypeAndDateAfterOrderByDateDesc(User user, String type, java.time.LocalDateTime date);
    List<Transaction> findByUserAndTypeAndCategoryAndDateAfterOrderByDateDesc(User user, String type, String category, java.time.LocalDateTime date);
}
