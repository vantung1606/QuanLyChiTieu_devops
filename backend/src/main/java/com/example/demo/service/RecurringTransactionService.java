package com.example.demo.service;

import com.example.demo.entity.Frequency;
import com.example.demo.entity.RecurringTransaction;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.RecurringTransactionRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<RecurringTransaction> getAllRecurringTransactions() {
        return recurringTransactionRepository.findByUser(getCurrentUser());
    }

    public RecurringTransaction createRecurring(RecurringTransaction recurring) {
        recurring.setUser(getCurrentUser());
        // Set first execution date if not provided
        if (recurring.getNextExecutionDate() == null) {
            recurring.setNextExecutionDate(recurring.getStartDate());
        }
        return recurringTransactionRepository.save(recurring);
    }

    public void deleteRecurring(Long id) {
        RecurringTransaction rt = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring transaction not found"));
        if (!rt.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }
        recurringTransactionRepository.delete(rt);
    }

    /**
     * Tác vụ tự động chạy hàng giờ để kiểm tra và tạo giao dịch mới
     */
    @Scheduled(cron = "0 0 * * * *") // Chạy mỗi đầu giờ
    @Transactional
    public void processRecurringTransactions() {
        log.info("Processing recurring transactions...");
        LocalDateTime now = LocalDateTime.now();
        List<RecurringTransaction> pending = recurringTransactionRepository.findByNextExecutionDateBeforeAndIsActiveTrue(now);

        for (RecurringTransaction rt : pending) {
            try {
                // 1. Tạo giao dịch thực tế
                Transaction transaction = Transaction.builder()
                        .title(rt.getTitle() + " (Định kỳ)")
                        .amount(rt.getAmount())
                        .type(rt.getType())
                        .category(rt.getCategory())
                        .date(rt.getNextExecutionDate())
                        .user(rt.getUser())
                        .build();
                transactionRepository.save(transaction);

                // 2. Cập nhật ngày thực hiện tiếp theo
                rt.setLastExecutedDate(rt.getNextExecutionDate());
                rt.setNextExecutionDate(calculateNextDate(rt.getNextExecutionDate(), rt.getFrequency()));

                // 3. Kiểm tra xem đã đến ngày kết thúc chưa
                if (rt.getEndDate() != null && rt.getNextExecutionDate().isAfter(rt.getEndDate())) {
                    rt.setActive(false);
                }

                recurringTransactionRepository.save(rt);
                log.info("Created recurring transaction: {} for user: {}", rt.getTitle(), rt.getUser().getUsername());
            } catch (Exception e) {
                log.error("Error processing recurring transaction ID: {}", rt.getId(), e);
            }
        }
    }

    private LocalDateTime calculateNextDate(LocalDateTime current, Frequency frequency) {
        return switch (frequency) {
            case DAILY -> current.plusDays(1);
            case WEEKLY -> current.plusWeeks(1);
            case MONTHLY -> current.plusMonths(1);
            case YEARLY -> current.plusYears(1);
        };
    }
}
