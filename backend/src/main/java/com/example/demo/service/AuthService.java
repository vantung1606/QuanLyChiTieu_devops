package com.example.demo.service;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final CategoryService categoryService;

    public AuthResponse register(RegisterRequest request) {
        log.info("AUTH_REGISTER_START username={} email={}", request.getUsername(), request.getEmail());

        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("AUTH_REGISTER_FAIL_DUP_USERNAME username={}", request.getUsername());
            throw new IllegalArgumentException("Ten dang nhap da ton tai.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("AUTH_REGISTER_FAIL_DUP_EMAIL email={}", request.getEmail());
            throw new IllegalArgumentException("Email da duoc su dung.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .currency("VND")
                .language("VI")
                .darkMode(false)
                .emailUpdates(true)
                .pushNotifs(false)
                .build();
        userRepository.save(user);

        categoryService.createDefaultCategories(user);

        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);

        log.info("AUTH_REGISTER_OK userId={} username={}", user.getId(), user.getUsername());
        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .darkMode(Boolean.TRUE.equals(user.getDarkMode()))
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .build();
    }

    public AuthResponse login(AuthRequest request, String userAgent, String ipAddress) {
        log.info("AUTH_LOGIN_START identity={} ip={} ua={}", request.getUsername(), ipAddress, userAgent);
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            var jwtToken = jwtService.generateToken(userDetails);

            log.info("AUTH_LOGIN_OK userId={} username={}", user.getId(), user.getUsername());
            return AuthResponse.builder()
                    .token(jwtToken)
                    .username(userDetails.getUsername())
                    .darkMode(Boolean.TRUE.equals(user.getDarkMode()))
                    .currency(user.getCurrency())
                    .language(user.getLanguage())
                    .build();
        } catch (Exception ex) {
            log.error("AUTH_LOGIN_FAIL identity={} ip={} reason={}", request.getUsername(), ipAddress, ex.getMessage(), ex);
            throw ex;
        }
    }
}
