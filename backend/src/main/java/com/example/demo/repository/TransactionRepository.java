package com.example.demo.repository;

import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    List<Transaction> findByUser(User user);
    List<Transaction> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDateTime start, LocalDateTime end);
    
    @Query(value = "SELECT * FROM transactions t WHERE t.user_id = :userId AND " +
            "(:type IS NULL OR t.type = :type) AND " +
            "(:category IS NULL OR t.category = :category) AND " +
            "(:startDate IS NULL OR t.date >= :startDate) AND " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY t.date DESC", 
            countQuery = "SELECT count(*) FROM transactions t WHERE t.user_id = :userId AND " +
            "(:type IS NULL OR t.type = :type) AND " +
            "(:category IS NULL OR t.category = :category) AND " +
            "(:startDate IS NULL OR t.date >= :startDate) AND " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.category) LIKE LOWER(CONCAT('%', :keyword, '%')))",
            nativeQuery = true)
    Page<Transaction> findFilteredTransactionsWithKeyword(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("category") String category,
            @Param("startDate") LocalDateTime startDate,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query(value = "SELECT * FROM transactions t WHERE t.user_id = :userId AND " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.category) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "ORDER BY t.date DESC", nativeQuery = true)
    List<Transaction> searchTransactions(
            @Param("userId") Long userId,
            @Param("query") String query);

    void deleteByUser(User user);
}
