-- Create Database
CREATE DATABASE IF NOT EXISTS lume_dental;
USE lume_dental;

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'patient') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Services Table (Optional but recommended for the foreign key)
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    user_id INT NULL, -- NULL for guest users
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    
    service_id INT,
    appointment_date DATETIME NOT NULL,
    
    comments TEXT,
    
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Insert initial services
INSERT INTO services (id, name, description, price) VALUES 
(1, 'Comprehensive Checkup', 'General checkup and cleaning', 150.00),
(2, 'Professional Whitening', 'Teeth whitening service', 200.00),
(3, 'Restorative Care', 'Fillings, crowns, and bridges', 300.00),
(4, 'Invisalign® Consultation', 'Clear aligners consultation', 100.00)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert dummy admin user (Password is 'admin123')
-- The hash below is for 'admin123' generated with bcrypt (salt rounds: 10)
INSERT INTO users (name, email, phone, password_hash, role) 
VALUES ('System Admin', 'admin@lumedental.com', '1234567890', '$2b$10$X8O.U/6qWjW.G/.Yj.sNQu0lXm4d5i3aC2o/s0F2dD6eB8p/2QZye', 'admin');
