package com.example.demo.service;


import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

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



    public UserDTO getProfile() {
        User user = getCurrentUser();
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .currency(user.getCurrency())
                .language(user.getLanguage())
                .darkMode(Boolean.TRUE.equals(user.getDarkMode()))
                .emailUpdates(Boolean.TRUE.equals(user.getEmailUpdates()))
                .pushNotifs(Boolean.TRUE.equals(user.getPushNotifs()))
                .avatar(user.getAvatar())
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

        if (dto.getAvatar() != null) {
            user.setAvatar(dto.getAvatar());
        }

        user.setDarkMode(Boolean.TRUE.equals(dto.getDarkMode()));
        user.setEmailUpdates(Boolean.TRUE.equals(dto.getEmailUpdates()));
        user.setPushNotifs(Boolean.TRUE.equals(dto.getPushNotifs()));
        
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
                .darkMode(Boolean.TRUE.equals(updatedUser.getDarkMode()))
                .emailUpdates(Boolean.TRUE.equals(updatedUser.getEmailUpdates()))
                .pushNotifs(Boolean.TRUE.equals(updatedUser.getPushNotifs()))
                .avatar(updatedUser.getAvatar())
                .build();
    }



    @Transactional
    public void deleteUser() {
        User user = getCurrentUser();
        
        // Delete all related data
        transactionRepository.deleteByUser(user);

        categoryRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteByEmail(user.getEmail());
        
        // Finally delete the user
        userRepository.delete(user);
    }
}
