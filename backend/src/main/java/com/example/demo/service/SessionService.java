package com.example.demo.service;

import com.example.demo.dto.UserSessionDTO;
import com.example.demo.entity.User;
import com.example.demo.entity.UserSession;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final UserSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public List<UserSessionDTO> getActiveSessions(String currentToken) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String currentTokenId = currentToken != null && currentToken.length() > 20 ? 
                currentToken.substring(currentToken.length() - 20) : "";

        return sessionRepository.findByUserIdAndIsRevokedFalse(user.getId())
                .stream()
                .map(s -> UserSessionDTO.builder()
                        .id(s.getId())
                        .userAgent(s.getUserAgent())
                        .ipAddress(s.getIpAddress())
                        .lastActive(s.getLastActive())
                        .isCurrent(s.getTokenId().equals(currentTokenId))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void revokeSession(Long sessionId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to revoke this session");
        }

        session.setRevoked(true);
        sessionRepository.save(session);
    }
}
