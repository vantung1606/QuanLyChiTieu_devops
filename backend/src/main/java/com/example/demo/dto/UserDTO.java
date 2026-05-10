package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String currency;
    private String language;
    private Boolean darkMode;
    private Boolean twoFactor;
    private Boolean emailUpdates;
    private Boolean pushNotifs;
}
