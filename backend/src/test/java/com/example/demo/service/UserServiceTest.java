package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSessionRepository;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserSessionRepository userSessionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

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
    void deleteUser_ShouldRemoveRelatedDataAndUser() {
        mockSecurityContext("testuser");

        userService.deleteUser();

        verify(transactionRepository).deleteByUser(mockUser);
        verify(userSessionRepository).deleteByUser(mockUser);
        verify(categoryRepository).deleteByUser(mockUser);
        verify(passwordResetTokenRepository).deleteByEmail("test@example.com");
        verify(userRepository).delete(mockUser);
    }
}
