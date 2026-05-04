CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    budget DOUBLE NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chèn dữ liệu mẫu
INSERT INTO categories (name, icon, color, budget) VALUES ('Ăn uống', 'Utensils', '#f59e0b', 2000000);
INSERT INTO categories (name, icon, color, budget) VALUES ('Học tập', 'GraduationCap', '#3b82f6', 3800000);
INSERT INTO categories (name, icon, color, budget) VALUES ('Giải trí', 'Film', '#8b5cf6', 600000);
INSERT INTO categories (name, icon, color, budget) VALUES ('Di chuyển', 'Train', '#10b981', 1000000);
INSERT INTO categories (name, icon, color, budget) VALUES ('Nhà cửa', 'Home', '#ef4444', 2500000);
INSERT INTO categories (name, icon, color, budget) VALUES ('Y tế', 'HeartPulse', '#ec4899', 1000000);
INSERT INTO categories (name, icon, color, budget) VALUES ('Tiện ích', 'Zap', '#f59e0b', 500000);
