CREATE TABLE recurring_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    frequency VARCHAR(20) NOT NULL, -- DAILY, WEEKLY, MONTHLY, YEARLY
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    last_executed_date DATETIME,
    next_execution_date DATETIME,
    user_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
