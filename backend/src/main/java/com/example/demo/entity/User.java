package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private String fullName;
    
    @Builder.Default
    private String currency = "VND";
    
    @Builder.Default
    private String language = "VI";
    
    @Builder.Default
    private Boolean darkMode = false;
    
    @Builder.Default
    private Boolean twoFactor = false;

    private String secretKey;
    
    @Builder.Default
    private Boolean emailUpdates = true;
    
    @Builder.Default
    private Boolean pushNotifs = false;

    @Column(columnDefinition = "LONGTEXT")
    private String avatar;
}
