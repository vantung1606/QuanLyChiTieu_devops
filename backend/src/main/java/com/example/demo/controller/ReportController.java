package com.example.demo.controller;

import com.example.demo.dto.ReportResponse;
import com.example.demo.dto.TransactionDTO;
import com.example.demo.service.ReportService;
import com.example.demo.service.TransactionService;
import com.example.demo.service.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReportController {

    private final ReportService reportService;
    private final TransactionService transactionService;
    private final PdfExportService pdfExportService;

    @GetMapping("/financial-performance")
    public ResponseEntity<ReportResponse> getFinancialPerformance(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(reportService.getFinancialReport(month, year));
    }

    @GetMapping("/export/pdf")
    public void exportToPDF(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String dateSuffix = (month != null && year != null) ? year + "_" + month : LocalDate.now().toString();
        String filename = "financial_report_" + dateSuffix + ".pdf";
        String headerValue = "attachment; filename=" + filename;
        response.setHeader(headerKey, headerValue);

        List<TransactionDTO> transactions;
        if (month != null && year != null) {
            transactions = transactionService.getFilteredTransactions(null, null, null).stream()
                    .filter(t -> t.getDate().getMonthValue() == month && t.getDate().getYear() == year)
                    .collect(Collectors.toList());
        } else {
            transactions = transactionService.getFilteredTransactions(null, null, 30);
        }
        
        pdfExportService.export(response, transactions);
    }
}
