package com.example.demo.service;

import com.example.demo.entity.Frequency;
import com.example.demo.entity.Notification;
import com.example.demo.entity.RecurringTransaction;
import com.example.demo.entity.Transaction;
import com.example.demo.repository.RecurringTransactionRepository;
import com.example.demo.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulingService {
    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;

    // Chạy vào lúc 0h05 mỗi ngày
    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void processRecurringTransactions() {
        log.info("Bắt đầu xử lý các giao dịch định kỳ: {}", LocalDateTime.now());
        
        List<RecurringTransaction> dueTransactions = recurringTransactionRepository
                .findByNextExecutionDateBeforeAndIsActiveTrue(LocalDateTime.now());

        for (RecurringTransaction rt : dueTransactions) {
            try {
                // 1. Tạo giao dịch thực tế
                Transaction transaction = Transaction.builder()
                        .title(rt.getTitle() + " (Định kỳ)")
                        .amount(rt.getAmount())
                        .type(rt.getType())
                        .category(rt.getCategory())
                        .date(LocalDateTime.now())
                        .user(rt.getUser())
                        .build();
                transactionRepository.save(transaction);

                // 2. Cập nhật ngày thực hiện tiếp theo
                rt.setLastExecutedDate(LocalDateTime.now());
                rt.setNextExecutionDate(calculateNextDate(rt.getNextExecutionDate(), rt.getFrequency()));
                
                // Kiểm tra ngày kết thúc
                if (rt.getEndDate() != null && rt.getNextExecutionDate().isAfter(rt.getEndDate())) {
                    rt.setActive(false);
                }
                recurringTransactionRepository.save(rt);

                // 3. Bắn thông báo
                String action = "income".equalsIgnoreCase(rt.getType()) ? "nhận được" : "thanh toán";
                notificationService.createNotification(
                        rt.getUser(),
                        "Giao dịch định kỳ hoàn tất",
                        "Đã tự động " + action + " " + String.format("%,.0f", rt.getAmount()) + " VNĐ cho: " + rt.getTitle(),
                        "RECURRING_PAID"
                );

                log.info("Đã xử lý thành công giao dịch định kỳ: {} cho user: {}", rt.getTitle(), rt.getUser().getUsername());
            } catch (Exception e) {
                log.error("Lỗi khi xử lý giao dịch định kỳ {}: {}", rt.getId(), e.getMessage());
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
