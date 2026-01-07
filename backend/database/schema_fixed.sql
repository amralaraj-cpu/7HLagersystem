-- 7HLager Database Schema
-- PostgreSQL Database for Tire & Wheel Inventory Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouse locations (18,200 total positions)
CREATE TABLE warehouse_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_code VARCHAR(20) UNIQUE NOT NULL,
    aisle CHAR(1) NOT NULL CHECK (aisle >= 'A' AND aisle <= 'Z'),
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 10),
    unit INTEGER NOT NULL CHECK (unit >= 1 AND unit <= 10),
    position INTEGER NOT NULL CHECK (position >= 1 AND position <= 7),
    is_customer_storage BOOLEAN DEFAULT false,
    is_occupied BOOLEAN DEFAULT false,
    occupied_by_item_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_location UNIQUE (aisle, level, unit, position, is_customer_storage)
);

-- Inventory items (tires, rims, complete wheels)
