package com.example.demo.controller;

import com.example.demo.dto.UserSessionDTO;
import com.example.demo.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<UserSessionDTO>> getActiveSessions(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        return ResponseEntity.ok(sessionService.getActiveSessions(token));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> revokeSession(@PathVariable Long id) {
        sessionService.revokeSession(id);
        return ResponseEntity.ok("Session revoked successfully");
    }
}
