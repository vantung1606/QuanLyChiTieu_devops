package com.example.demo.repository;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetweenOrderByDateAsc(User user, java.time.LocalDateTime start, java.time.LocalDateTime end);
    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM transactions t WHERE t.user_id = :userId AND " +
            "(:type IS NULL OR t.type = :type) AND " +
            "(:category IS NULL OR t.category = :category) AND " +
            "(:startDate IS NULL OR t.date >= :startDate) AND " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY t.date DESC", nativeQuery = true)
    List<Transaction> findFilteredTransactionsWithKeyword(
            @org.springframework.data.repository.query.Param("userId") Long userId,
            @org.springframework.data.repository.query.Param("type") String type,
            @org.springframework.data.repository.query.Param("category") String category,
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate,
            @org.springframework.data.repository.query.Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM transactions t WHERE t.user_id = :userId AND " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.category) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY t.date DESC", nativeQuery = true)
    List<Transaction> searchTransactions(
            @org.springframework.data.repository.query.Param("userId") Long userId,
            @org.springframework.data.repository.query.Param("query") String query);

    void deleteByUser(User user);
}
