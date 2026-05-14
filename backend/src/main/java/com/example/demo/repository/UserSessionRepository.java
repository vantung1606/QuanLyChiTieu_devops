package com.example.demo.repository;

import com.example.demo.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    List<UserSession> findByUserIdAndIsRevokedFalse(Long userId);
    Optional<UserSession> findByTokenId(String tokenId);
    List<UserSession> findByUser(User user);
    void deleteByUser(User user);
}
