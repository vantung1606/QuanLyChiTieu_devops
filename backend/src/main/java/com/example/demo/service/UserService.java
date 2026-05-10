package com.example.demo.service;

import com.example.demo.dto.PasswordChangeRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TwoFactorAuthService twoFactorAuthService;

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public com.example.demo.dto.TwoFactorSetupResponse setup2FA() {
        User user = getCurrentUser();
        String secret = twoFactorAuthService.generateNewSecret();
        user.setSecretKey(secret);
        userRepository.save(user);
        
        String qrCodeUrl = twoFactorAuthService.getQrCodeUrl(secret, user.getUsername());
        return com.example.demo.dto.TwoFactorSetupResponse.builder()
                .secretKey(secret)
                .qrCodeUrl(qrCodeUrl)
                .build();
    }

    public void confirm2FA(int code) {
        User user = getCurrentUser();
        if (twoFactorAuthService.isOtpValid(user.getSecretKey(), code)) {
            user.setTwoFactor(true);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Mã xác thực không đúng.");
        }
    }

    public void disable2FA() {
        User user = getCurrentUser();
        user.setTwoFactor(false);
        user.setSecretKey(null);
        userRepository.save(user);
    }

    public UserDTO getProfile() {
        User user = getCurrentUser();
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .darkMode(user.isDarkMode())
                .twoFactor(user.isTwoFactor())
                .emailUpdates(user.isEmailUpdates())
                .pushNotifs(user.isPushNotifs())
                .build();
    }

    @Transactional
    public UserDTO updateProfile(UserDTO dto) {
        User user = getCurrentUser();
        
        // Update fields if provided
        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }

        if (dto.getCurrency() != null) {
            user.setCurrency(dto.getCurrency());
        }

        if (dto.getLanguage() != null) {
            user.setLanguage(dto.getLanguage());
        }

        user.setDarkMode(dto.isDarkMode());
        // Do not update twoFactor directly here to ensure user confirmed setup
        // user.setTwoFactor(dto.isTwoFactor());
        user.setEmailUpdates(dto.isEmailUpdates());
        user.setPushNotifs(dto.isPushNotifs());
        
        // Email check
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(dto.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return UserDTO.builder()
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .fullName(updatedUser.getFullName())
                .currency(updatedUser.getCurrency())
                .language(updatedUser.getLanguage())
                .darkMode(updatedUser.isDarkMode())
                .twoFactor(updatedUser.isTwoFactor())
                .emailUpdates(updatedUser.isEmailUpdates())
                .pushNotifs(updatedUser.isPushNotifs())
                .build();
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = getCurrentUser();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
