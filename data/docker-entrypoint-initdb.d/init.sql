-- Xóa database nếu đã tồn tại
DROP DATABASE IF EXISTS quan_ly_nhan_su;
CREATE DATABASE quan_ly_nhan_su;

-- Chuyển vào database quan_ly_nhan_su
\c quan_ly_nhan_su;

-- Xóa bảng nếu đã tồn tại
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Tạo bảng roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(10) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    refresh_token TEXT DEFAULT '',
    status VARCHAR(10) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    role_id INT NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- Chèn dữ liệu mẫu vào bảng roles
INSERT INTO roles (role) VALUES ('admin'), ('user');

-- Chèn dữ liệu mẫu vào bảng users
-- Mật khẩu đã được mã hóa trước là: $2b$10$c1XuziBzOZ3tnz/VaAzbAe65hhz70LbvUkXv/ceNnW5wyFtnhv6Gm
INSERT INTO users (username, fullname, password, role_id)
VALUES ('admin', 'Admin User', '$2b$10$c1XuziBzOZ3tnz/VaAzbAe65hhz70LbvUkXv/ceNnW5wyFtnhv6Gm', 1),
('employee', 'employee User', '$2b$10$c1XuziBzOZ3tnz/VaAzbAe65hhz70LbvUkXv/ceNnW5wyFtnhv6Gm', 1);
