
-- Create dreamsite database
CREATE DATABASE IF NOT EXISTS dreamsite;

-- Select dreamsite database
USE dreamsite;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Create dream_entries table
CREATE TABLE IF NOT EXISTS dream_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dream_text TEXT NOT NULL,
    dream_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
