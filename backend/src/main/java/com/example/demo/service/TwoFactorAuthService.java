package com.example.demo.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class TwoFactorAuthService {

    private final GoogleAuthenticator gAuth;

    public TwoFactorAuthService() {
        this.gAuth = new GoogleAuthenticator();
    }

    public String generateNewSecret() {
        final GoogleAuthenticatorKey key = gAuth.createCredentials();
        return key.getSecret();
    }

    public String getQrCodeUrl(String secret, String username) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("Equinox Finance", username, 
                new GoogleAuthenticatorKey.Builder(secret).build());
    }

    public boolean isOtpValid(String secret, int code) {
        return gAuth.authorize(secret, code);
    }
}
