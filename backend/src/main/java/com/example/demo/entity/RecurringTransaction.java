package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recurring_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be zero or positive")
    private Double amount;

    @NotBlank(message = "Type is required (income/expense)")
    private String type;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Frequency is required")
    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime lastExecutedDate;

    @NotNull(message = "Next execution date is required")
    private LocalDateTime nextExecutionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
