-- Defensive script to add user_id column if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'categories';
SET @columnname = 'user_id';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  'ALTER TABLE categories ADD COLUMN user_id BIGINT'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Try to add foreign key if not exists
SET @constraintname = 'fk_categories_user';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND CONSTRAINT_NAME = @constraintname) > 0,
  'SELECT 1',
  'ALTER TABLE categories ADD CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id)'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Attempt to drop old index 'name' if it exists
SET @indexname = 'name';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND INDEX_NAME = @indexname) > 0,
  'ALTER TABLE categories DROP INDEX name',
  'SELECT 1'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add new composite unique index if not exists
SET @indexname = 'uq_name_user';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND INDEX_NAME = @indexname) > 0,
  'SELECT 1',
  'ALTER TABLE categories ADD UNIQUE INDEX uq_name_user (name, user_id)'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
