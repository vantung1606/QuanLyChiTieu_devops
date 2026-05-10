package com.example.demo.controller;

import com.example.demo.dto.ReportResponse;
import com.example.demo.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReportController {

    private final ReportService reportService;
    private final com.example.demo.service.TransactionService transactionService;
    private final com.example.demo.service.PdfExportService pdfExportService;

    @GetMapping("/financial-performance")
    public ResponseEntity<ReportResponse> getFinancialPerformance(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer month,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getFinancialReport(month, year));
    }

    @GetMapping("/export/pdf")
    public void exportToPDF(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer month,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Integer year,
            jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String filename = "financial_report_" + (month != null ? year + "_" + month : java.time.LocalDate.now()) + ".pdf";
        String headerValue = "attachment; filename=" + filename;
        response.setHeader(headerKey, headerValue);

        // Fetch transactions for the specific month if provided
        List<com.example.demo.dto.TransactionDTO> transactions;
        if (month != null && year != null) {
            // Get all transactions for that month by setting a large 'days' value and filtering in service
            // Or better, let's use a more direct approach if available.
            // For now, we'll fetch them and filter manually if needed, or use the existing service.
            transactions = transactionService.getFilteredTransactions(null, null, null).stream()
                    .filter(t -> t.getDate().getMonthValue() == month && t.getDate().getYear() == year)
                    .collect(java.util.stream.Collectors.toList());
        } else {
            transactions = transactionService.getFilteredTransactions(null, null, 30);
        }
        
        pdfExportService.export(response, transactions);
    }
}
