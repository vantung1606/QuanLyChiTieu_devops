package com.example.demo.service;

import com.example.demo.dto.PasswordChangeRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TwoFactorAuthService twoFactorAuthService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setFullName("Test User");

        SecurityContextHolder.setContext(securityContext);
    }

    private void mockSecurityContext(String username) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
    }

    @Test
    void getProfile_ShouldReturnUserDTO() {
        mockSecurityContext("testuser");

        UserDTO profile = userService.getProfile();

        assertNotNull(profile);
        assertEquals("testuser", profile.getUsername());
        assertEquals("test@example.com", profile.getEmail());
    }

    @Test
    void updateProfile_ShouldUpdateUserFields() {
        mockSecurityContext("testuser");
        UserDTO updateDto = UserDTO.builder()
                .fullName("New Name")
                .currency("EUR")
                .build();

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO result = userService.updateProfile(updateDto);

        assertEquals("New Name", result.getFullName());
        assertEquals("EUR", result.getCurrency());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void changePassword_WithCorrectCurrentPassword_ShouldSucceed() {
        mockSecurityContext("testuser");
        PasswordChangeRequest request = new PasswordChangeRequest("oldPass", "newPass");

        when(passwordEncoder.matches("oldPass", mockUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("newEncodedPass");

        userService.changePassword(request);

        verify(passwordEncoder).encode("newPass");
        verify(userRepository).save(mockUser);
    }

    @Test
    void changePassword_WithIncorrectCurrentPassword_ShouldThrowException() {
        mockSecurityContext("testuser");
        PasswordChangeRequest request = new PasswordChangeRequest("wrongPass", "newPass");

        when(passwordEncoder.matches("wrongPass", mockUser.getPassword())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.changePassword(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void confirm2FA_WithValidCode_ShouldEnable2FA() {
        mockSecurityContext("testuser");
        String code = "123456";
        when(twoFactorAuthService.isOtpValid("testuser", code)).thenReturn(true);

        userService.confirm2FA(code);

        assertTrue(mockUser.getTwoFactor());
        verify(userRepository).save(mockUser);
    }

    @Test
    void confirm2FA_WithInvalidCode_ShouldThrowException() {
        mockSecurityContext("testuser");
        String code = "wrong";
        when(twoFactorAuthService.isOtpValid("testuser", code)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.confirm2FA(code));
        assertFalse(mockUser.getTwoFactor());
        verify(userRepository, never()).save(any(User.class));
    }
}
