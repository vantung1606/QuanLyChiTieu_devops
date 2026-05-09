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
    public ResponseEntity<ReportResponse> getFinancialPerformance() {
        return ResponseEntity.ok(reportService.getFinancialReport());
    }

    @GetMapping("/export/pdf")
    public void exportToPDF(jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=financial_report_" + java.time.LocalDate.now() + ".pdf";
        response.setHeader(headerKey, headerValue);

        var transactions = transactionService.getAllTransactions();
        pdfExportService.export(response, transactions);
    }
}
