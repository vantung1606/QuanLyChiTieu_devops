package com.example.demo.service;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final CategoryService categoryService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .currency("VND")
                .language("VI")
                .darkMode(false)
                .twoFactor(false)
                .emailUpdates(true)
                .pushNotifs(false)
                .build();
        userRepository.save(user);

        categoryService.createDefaultCategories(user);

        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .darkMode(Boolean.TRUE.equals(user.getDarkMode()))
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

        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(userDetails.getUsername())
                .darkMode(Boolean.TRUE.equals(user.getDarkMode()))
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .build();
    }
}
