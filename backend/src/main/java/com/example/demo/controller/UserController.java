package com.example.demo.controller;

import com.example.demo.dto.PasswordChangeRequest;
import com.example.demo.dto.UserDTO;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateProfile(userDTO));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/2fa/setup")
    public ResponseEntity<com.example.demo.dto.TwoFactorSetupResponse> setup2FA() {
        return ResponseEntity.ok(userService.setup2FA());
    }

    @PostMapping("/2fa/confirm")
    public ResponseEntity<String> confirm2FA(@RequestBody com.example.demo.dto.TwoFactorRequest request) {
        try {
            userService.confirm2FA(request.getCode());
            return ResponseEntity.ok("2FA enabled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/2fa/disable")
    public ResponseEntity<String> disable2FA() {
        userService.disable2FA();
        return ResponseEntity.ok("2FA disabled successfully");
    }
}
