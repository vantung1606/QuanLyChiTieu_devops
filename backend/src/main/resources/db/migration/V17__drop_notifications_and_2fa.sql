DROP TABLE IF EXISTS notifications;

ALTER TABLE users
    DROP COLUMN two_factor,
    DROP COLUMN secret_key;
