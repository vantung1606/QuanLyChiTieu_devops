-- Password is 'password123' encoded with BCrypt
INSERT INTO users (username, password, email, full_name) 
VALUES ('admin', '$2a$10$8.UnVuG9shgButw1be5wOtJyJZLIV47Xyzl.fO3p8.yGZl.6tEBy2', 'admin@example.com', 'System Admin')
ON DUPLICATE KEY UPDATE username=username;
