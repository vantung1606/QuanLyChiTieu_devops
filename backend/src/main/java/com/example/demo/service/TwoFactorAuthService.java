package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TwoFactorAuthService {

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateNewSecret() {
        // For Email OTP, the "secret" is just the current OTP
        return String.format("%06d", random.nextInt(1000000));
    }

    public void storeOtp(String username, String otp) {
        otpStorage.put(username, otp);
        // OTP expires in 5 minutes
        new Thread(() -> {
            try {
                Thread.sleep(5 * 60 * 1000);
                otpStorage.remove(username, otp);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }

    public boolean isOtpValid(String username, String code) {
        String storedOtp = otpStorage.get(username);
        if (storedOtp != null && storedOtp.equals(code)) {
            otpStorage.remove(username);
            return true;
        }
        return false;
    }
}
