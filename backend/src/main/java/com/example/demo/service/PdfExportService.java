package com.example.demo.service;

import com.example.demo.dto.TransactionDTO;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfExportService {

    public void export(HttpServletResponse response, List<TransactionDTO> transactions) throws IOException {
        System.out.println("Starting PDF export for " + (transactions != null ? transactions.size() : 0) + " transactions");
        
        if (transactions == null) {
            System.err.println("Transactions list is null!");
            return;
        }

        Document document = new Document(PageSize.A4);
        try {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            // Load font for Vietnamese support
            BaseFont bf;
            try {
                // Try system font first
                bf = BaseFont.createFont("C:\\Windows\\Fonts\\arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            } catch (Exception e) {
                System.err.println("Arial not found, falling back to Helvetica (Vietnamese may not show correctly)");
                bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            }
            
            Font fontTitle = new Font(bf, 22, Font.BOLD, new Color(15, 23, 42));
            Font fontSubtitle = new Font(bf, 10, Font.NORMAL, new Color(100, 116, 139));
            Font fontHeader = new Font(bf, 11, Font.BOLD, Color.WHITE);
            Font fontRow = new Font(bf, 10, Font.NORMAL, new Color(30, 41, 59));

            // Header
            Paragraph title = new Paragraph("BÁO CÁO TÀI CHÍNH CHI TIẾT", fontTitle);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            Paragraph subtitle = new Paragraph("Hệ thống quản lý chi tiêu Equinox Finance", fontSubtitle);
            subtitle.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(subtitle);

            String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            Paragraph dateGen = new Paragraph("Ngày xuất: " + nowStr, fontSubtitle);
            dateGen.setAlignment(Paragraph.ALIGN_CENTER);
            dateGen.setSpacingAfter(25);
            document.add(dateGen);

            // Summary
            double totalIncome = transactions.stream()
                    .filter(t -> "income".equalsIgnoreCase(t.getType()))
                    .mapToDouble(TransactionDTO::getAmount).sum();
            double totalExpense = transactions.stream()
                    .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                    .mapToDouble(TransactionDTO::getAmount).sum();

            PdfPTable summaryTable = new PdfPTable(3);
            summaryTable.setWidthPercentage(100);
            summaryTable.setSpacingAfter(20);
            
            addSummaryCell(summaryTable, "TỔNG THU", String.format("%,.0f VNĐ", totalIncome), new Color(16, 185, 129), bf);
            addSummaryCell(summaryTable, "TỔNG CHI", String.format("%,.0f VNĐ", totalExpense), new Color(239, 44, 44), bf);
            addSummaryCell(summaryTable, "SỐ DƯ", String.format("%,.0f VNĐ", totalIncome - totalExpense), new Color(59, 130, 246), bf);
            document.add(summaryTable);

            // Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.0f, 4.0f, 2.5f, 2.0f, 3.0f});

            String[] headers = {"NGÀY", "TIÊU ĐỀ", "DANH MỤC", "LOẠI", "SỐ TIỀN"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, fontHeader));
                cell.setBackgroundColor(new Color(15, 23, 42));
                cell.setPadding(10);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            for (TransactionDTO t : transactions) {
                table.addCell(createStyledCell(t.getDate().format(dtf), fontRow, Element.ALIGN_CENTER));
                table.addCell(createStyledCell(t.getTitle(), fontRow, Element.ALIGN_LEFT));
                table.addCell(createStyledCell(t.getCategory(), fontRow, Element.ALIGN_CENTER));
                
                PdfPCell typeCell = createStyledCell(t.getType().toUpperCase(), fontRow, Element.ALIGN_CENTER);
                if ("income".equalsIgnoreCase(t.getType())) {
                    typeCell.setBackgroundColor(new Color(236, 253, 245));
                } else {
                    typeCell.setBackgroundColor(new Color(254, 242, 242));
                }
                table.addCell(typeCell);

                String amtText = ("income".equalsIgnoreCase(t.getType()) ? "+" : "-") + String.format("%,.0f", t.getAmount()) + " VNĐ";
                Color amtColor = "income".equalsIgnoreCase(t.getType()) ? new Color(5, 150, 105) : new Color(185, 28, 28);
                Font amtFont = new Font(bf, 10, Font.BOLD, amtColor);
                PdfPCell amtCell = new PdfPCell(new Phrase(amtText, amtFont));
                amtCell.setPadding(8);
                amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                amtCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                amtCell.setBorderColor(new Color(226, 232, 240));
                table.addCell(amtCell);
            }

            document.add(table);
        } catch (Exception e) {
            System.err.println("Fatal error during PDF generation: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("PDF Generation failed", e);
        } finally {
            if (document.isOpen()) document.close();
        }
    }

    private void addSummaryCell(PdfPTable table, String label, String value, Color color, BaseFont bf) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(15);
        cell.setBorderColor(new Color(226, 232, 240));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Font labelFont = new Font(bf, 9, Font.BOLD, new Color(100, 116, 139));
        Paragraph p1 = new Paragraph(label, labelFont);
        p1.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(p1);
        
        Font valFont = new Font(bf, 14, Font.BOLD, color);
        Paragraph p2 = new Paragraph(value, valFont);
        p2.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(p2);
        
        table.addCell(cell);
    }

    private PdfPCell createStyledCell(String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setHorizontalAlignment(alignment);
        cell.setBorderColor(new Color(226, 232, 240));
        return cell;
    }
}
