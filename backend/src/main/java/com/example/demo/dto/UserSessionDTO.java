package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionDTO {
    private Long id;
    private String userAgent;
    private String ipAddress;
    private LocalDateTime lastActive;
    private boolean isCurrent;
}
