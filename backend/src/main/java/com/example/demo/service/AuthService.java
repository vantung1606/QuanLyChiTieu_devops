package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.User;
import com.example.demo.entity.PasswordResetToken;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSessionRepository;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final TwoFactorAuthService twoFactorAuthService;

    private final UserSessionRepository sessionRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .build();
        userRepository.save(user);
        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);
        
        // Record session for registration too
        recordSession(user, jwtToken, "Initial Registration", "Unknown");

        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .darkMode(user.isDarkMode())
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .build();
    }

    public AuthResponse login(AuthRequest request, String userAgent, String ipAddress) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isTwoFactor()) {
            return AuthResponse.builder()
                    .username(user.getUsername())
                    .requires2FA(true)
                    .build();
        }

        var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);

        // Record the session
        recordSession(user, jwtToken, userAgent, ipAddress);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(userDetails.getUsername())
                .darkMode(user.isDarkMode())
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .build();
    }

    public AuthResponse verify2FA(String username, int code, String userAgent, String ipAddress) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!twoFactorAuthService.isOtpValid(user.getSecretKey(), code)) {
            throw new RuntimeException("Mã xác thực không đúng.");
        }

        var userDetails = userDetailsService.loadUserByUsername(username);
        var jwtToken = jwtService.generateToken(userDetails);

        recordSession(user, jwtToken, userAgent, ipAddress);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(userDetails.getUsername())
                .darkMode(user.isDarkMode())
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .build();
    }

    private void recordSession(User user, String token, String userAgent, String ipAddress) {
        var session = com.example.demo.entity.UserSession.builder()
                .user(user)
                .tokenId(token.substring(token.length() - 20)) // Store last 20 chars as identifier
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .lastActive(LocalDateTime.now())
                .isRevoked(false)
                .build();
        sessionRepository.save(session);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        try {
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại trong hệ thống."));

            // Delete old tokens for this email
            tokenRepository.deleteByEmail(user.getEmail());

            // Create new token
            String token = UUID.randomUUID().toString();
            var resetToken = PasswordResetToken.builder()
                    .token(token)
                    .email(user.getEmail())
                    .expiryDate(LocalDateTime.now().plusMinutes(15))
                    .used(false)
                    .build();
            
            tokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        } catch (Exception e) {
            System.err.println("ERROR in forgotPassword: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to let the GlobalExceptionHandler handle it
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        var resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Mã token không hợp lệ."));

        if (resetToken.isExpired()) {
            throw new RuntimeException("Mã token đã hết hạn.");
        }

        if (resetToken.isUsed()) {
            throw new RuntimeException("Mã token đã được sử dụng.");
        }

        var user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
