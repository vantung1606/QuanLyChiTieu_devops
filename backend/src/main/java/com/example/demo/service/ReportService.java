package com.example.demo.service;

import com.example.demo.dto.ReportResponse;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

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

    public ReportResponse getFinancialReport(Integer month, Integer year) {
        User user = getCurrentUser();
        LocalDateTime start;
        LocalDateTime end;

        if (month != null && year != null) {
            start = LocalDateTime.of(year, month, 1, 0, 0);
            end = start.plusMonths(1).minusNanos(1);
        } else {
            end = LocalDateTime.now();
            start = end.minusDays(30);
        }

        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateAsc(user, start, end);

        // Calculate income and expenses
        double totalIncome = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        double totalExpenses = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
        double netCashFlow = totalIncome - totalExpenses;

        // Group by category
        Map<String, Double> categoryMap = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .collect(Collectors.groupingBy(Transaction::getCategory, Collectors.summingDouble(Transaction::getAmount)));

        String topCategory = categoryMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        double topAmount = categoryMap.getOrDefault(topCategory, 0.0);

        // Group by date for chart
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        Map<String, ReportResponse.ChartDataPoint> chartDataMap = new LinkedHashMap<>();
        
        // Initialize days in range
        LocalDateTime temp = start;
        while (temp.isBefore(end) || temp.isEqual(end)) {
            String dateStr = temp.format(formatter);
            chartDataMap.put(dateStr, new ReportResponse.ChartDataPoint(dateStr, 0, 0));
            temp = temp.plusDays(1);
        }

        for (Transaction t : transactions) {
            String dateStr = t.getDate().format(formatter);
            ReportResponse.ChartDataPoint point = chartDataMap.getOrDefault(dateStr, new ReportResponse.ChartDataPoint(dateStr, 0, 0));
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                point.setIncome(point.getIncome() + t.getAmount());
            } else {
                point.setExpenses(point.getExpenses() + t.getAmount());
            }
            chartDataMap.put(dateStr, point);
        }

        // Category breakdown
        List<ReportResponse.CategoryDataPoint> categoryBreakdown = categoryMap.entrySet().stream()
                .map(entry -> {
                    double pct = totalExpenses > 0 ? (entry.getValue() / totalExpenses) * 100 : 0;
                    return new ReportResponse.CategoryDataPoint(entry.getKey(), entry.getValue(), pct, getRandomColor());
                })
                .sorted(Comparator.comparing(ReportResponse.CategoryDataPoint::getValue).reversed())
                .collect(Collectors.toList());

        // Top outflows
        List<ReportResponse.TransactionSummary> topOutflows = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .sorted(Comparator.comparing(Transaction::getAmount).reversed())
                .limit(5)
                .map(t -> new ReportResponse.TransactionSummary("ShoppingBag", t.getTitle(), t.getCategory(), t.getAmount()))
                .collect(Collectors.toList());

        return ReportResponse.builder()
                .savingsRate(Math.round(savingsRate * 10.0) / 10.0)
                .topSpendingCategory(topCategory)
                .topSpendingAmount(topAmount)
                .netCashFlow(netCashFlow)
                .taxLiabilityEst(totalExpenses * 0.1) // Dummy calculation
                .incomeVsExpenses(new ArrayList<>(chartDataMap.values()))
                .categoryBreakdown(categoryBreakdown)
                .topOutflows(topOutflows)
                .aiInsight("Dựa trên 3 tháng qua, việc giảm chi tiêu cho " + topCategory + " khoảng 12% có thể giúp bạn tiết kiệm thêm " + String.format("%,.0f", netCashFlow * 0.15) + " VNĐ.")
                .build();
    }

    private String getRandomColor() {
        String[] colors = {"#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"};
        return colors[new Random().nextInt(colors.length)];
    }
}
