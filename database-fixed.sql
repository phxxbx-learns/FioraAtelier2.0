-- Fiora Atelier Inventory Management System - UPDATED FOR INFINITYFREE
-- DO NOT CREATE DATABASE - USE EXISTING ONE

-- Users table for admin access
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'manager') DEFAULT 'manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (linked to your existing products)
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    price DECIMAL(10,2),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    current_stock INT DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    max_stock_level INT DEFAULT 100,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_id INT NOT NULL,
    status ENUM('pending', 'ordered', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0,
    order_date DATE,
    expected_delivery DATE,
    actual_delivery DATE NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Purchase Order Items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) AS (quantity * unit_cost) STORED,
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inventory Transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reference_type ENUM('purchase_order', 'sale', 'adjustment') NOT NULL,
    reference_id INT NULL,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default admin user (password: 'password')
INSERT IGNORE INTO users (username, password, email, full_name, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@fioraatelier.co', 'Administrator', 'admin');

-- Insert sample suppliers
INSERT IGNORE INTO suppliers (name, contact_person, email, phone, address) VALUES 
('Bloom Suppliers Inc.', 'Maria Santos', 'maria@bloomsuppliers.com', '+63 2 1234 5678', '123 Flower Street, Quezon City'),
('Petals & Stems Co.', 'John Reyes', 'john@petalsandstems.com', '+63 2 2345 6789', '456 Garden Avenue, Makati City'),
('Evergreen Florist Supply', 'Anna Lopez', 'anna@evergreen.com', '+63 2 3456 7890', '789 Bloom Road, Mandaluyong City');