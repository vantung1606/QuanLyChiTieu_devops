package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;
        String message = "Chào bạn,\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào đường dẫn dưới đây để thực hiện:\n"
                + resetUrl + "\n\nĐường dẫn này sẽ hết hạn sau 15 phút.\n\nNếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.";

        // For now, we print to console so the user can see it without real SMTP config
        System.out.println("---------------------------------------");
        System.out.println("SENDING EMAIL TO: " + to);
        System.out.println("RESET URL: " + resetUrl);
        System.out.println("---------------------------------------");

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject("Yêu cầu đặt lại mật khẩu - QuanLyChiTieu");
            mailMessage.setText(message);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("---------------------------------------");
            System.err.println("NOTICE: Real email could not be sent because SMTP is not configured.");
            System.err.println("Error: " + e.getMessage());
            System.err.println("This is expected in development. Use the URL printed above.");
            System.err.println("---------------------------------------");
        }
    }

    public void sendOtpEmail(String to, String otp) {
        String message = "Mã xác nhận bảo mật của bạn là: " + otp + "\n\n"
                + "Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.";

        System.out.println("---------------------------------------");
        System.out.println("SENDING OTP EMAIL TO: " + to);
        System.out.println("OTP CODE: " + otp);
        System.out.println("---------------------------------------");

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(to);
            mailMessage.setSubject("Mã xác nhận 2FA - QuanLyChiTieu");
            mailMessage.setText(message);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("NOTICE: Real OTP email could not be sent. Check console for code.");
        }
    }
}
