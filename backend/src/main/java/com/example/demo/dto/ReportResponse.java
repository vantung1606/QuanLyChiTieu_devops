package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private double savingsRate;
    private String topSpendingCategory;
    private double topSpendingAmount;
    private double netCashFlow;
    private double taxLiabilityEst;
    private List<ChartDataPoint> incomeVsExpenses;
    private List<CategoryDataPoint> categoryBreakdown;
    private List<TransactionSummary> topOutflows;
    private String aiInsight;

    @Data
    @AllArgsConstructor
    public static class ChartDataPoint {
        private String date;
        private double income;
        private double expenses;
    }

    @Data
    @AllArgsConstructor
    public static class CategoryDataPoint {
        private String name;
        private double value;
        private double percentage;
        private String color;
    }

    @Data
    @AllArgsConstructor
    public static class TransactionSummary {
        private String icon;
        private String name;
        private String category;
        private double amount;
    }
}
