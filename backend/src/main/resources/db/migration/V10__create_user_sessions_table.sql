CREATE TABLE user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_id VARCHAR(255) NOT NULL,
    user_agent VARCHAR(512),
    ip_address VARCHAR(45),
    last_active DATETIME NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
