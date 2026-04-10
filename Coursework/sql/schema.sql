-- PostgreSQL schema for Church of Uganda MIS

CREATE TABLE diocese (
    diocese_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    province VARCHAR(100),
    address TEXT
);

CREATE TABLE archdeaconry (
    archdeaconry_id SERIAL PRIMARY KEY,
    diocese_id INTEGER NOT NULL REFERENCES diocese(diocese_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    location TEXT
);

CREATE TABLE parish (
    parish_id SERIAL PRIMARY KEY,
    archdeaconry_id INTEGER NOT NULL REFERENCES archdeaconry(archdeaconry_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    address TEXT
);

CREATE TABLE subparish (
    subparish_id SERIAL PRIMARY KEY,
    parish_id INTEGER NOT NULL REFERENCES parish(parish_id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    address TEXT
);

CREATE TABLE household (
    household_id SERIAL PRIMARY KEY,
    subparish_id INTEGER NOT NULL REFERENCES subparish(subparish_id) ON DELETE CASCADE,
    household_name VARCHAR(200) NOT NULL,
    head_name VARCHAR(150)
);

CREATE TABLE member (
    member_id SERIAL PRIMARY KEY,
    household_id INTEGER NOT NULL REFERENCES household(household_id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(30),
    email VARCHAR(150),
    membership_status VARCHAR(50) NOT NULL DEFAULT 'Active'
);

CREATE TABLE sacrament (
    sacrament_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES member(member_id) ON DELETE CASCADE,
    sacrament_type VARCHAR(50) NOT NULL,
    sacrament_date DATE NOT NULL,
    location VARCHAR(200),
    officiant VARCHAR(150)
);

CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL REFERENCES role(role_id),
    assigned_unit_type VARCHAR(30),
    assigned_unit_id INTEGER,
    email VARCHAR(150)
);

CREATE TABLE transaction_record (
    transaction_id SERIAL PRIMARY KEY,
    unit_type VARCHAR(30) NOT NULL,
    unit_id INTEGER NOT NULL,
    transaction_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    transaction_type VARCHAR(30) NOT NULL,
    description TEXT
);

CREATE VIEW parish_financial_summary AS
SELECT
    p.parish_id,
    p.name AS parish_name,
    SUM(t.amount) FILTER (WHERE t.transaction_type = 'Income') AS total_income,
    SUM(t.amount) FILTER (WHERE t.transaction_type = 'Expense') AS total_expense,
    SUM(t.amount) FILTER (WHERE t.transaction_type = 'Income') - SUM(t.amount) FILTER (WHERE t.transaction_type = 'Expense') AS net_balance
FROM parish p
JOIN transaction_record t ON t.unit_type = 'Parish' AND t.unit_id = p.parish_id
GROUP BY p.parish_id, p.name;
