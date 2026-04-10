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

-- Seed data for Church of Uganda MIS
INSERT INTO diocese (name, province, address) VALUES
('Kampala Diocese', 'Central', 'Kampala, Uganda');

INSERT INTO archdeaconry (diocese_id, name, location) VALUES
(1, 'Kampala North Archdeaconry', 'Kampala North'),
(1, 'Kampala South Archdeaconry', 'Kampala South');

INSERT INTO parish (archdeaconry_id, name, address) VALUES
(1, 'St. Mark Parish', 'Kawempe Road'),
(1, 'St. Stephen Parish', 'Makerere Hill'),
(2, 'St. Paul Parish', 'Ntinda'),
(2, 'St. Luke Parish', 'Bukoto');

INSERT INTO subparish (parish_id, name, address) VALUES
(1, 'St. Mark SubParish A', 'Kawempe East'),
(1, 'St. Mark SubParish B', 'Kawempe West'),
(2, 'St. Stephen SubParish A', 'Makerere East'),
(3, 'St. Paul SubParish A', 'Ntinda Central');

INSERT INTO household (subparish_id, household_name, head_name) VALUES
(1, 'Kato Family', 'Robert Kato'),
(1, 'Nansubuga Family', 'Grace Nansubuga'),
(2, 'Mugisha Family', 'Peter Mugisha'),
(3, 'Auma Family', 'Sarah Auma');

INSERT INTO member (household_id, first_name, last_name, date_of_birth, gender, phone, email, membership_status) VALUES
(1, 'John', 'Kato', '1990-05-12', 'Male', '0700123456', 'john.kato@example.com', 'Active'),
(1, 'Mary', 'Kato', '1993-09-21', 'Female', '0700654321', 'mary.kato@example.com', 'Active'),
(2, 'Peter', 'Mugisha', '1985-12-02', 'Male', '0700987654', 'peter.mugisha@example.com', 'Active'),
(3, 'Sarah', 'Auma', '1998-03-16', 'Female', '0700765432', 'sarah.auma@example.com', 'Inactive');

INSERT INTO sacrament (member_id, sacrament_type, sacrament_date, location, officiant) VALUES
(1, 'Baptism', '1990-06-20', 'St. Mark Church', 'Revd. N. Kintu'),
(1, 'Confirmation', '2005-07-10', 'St. Mark Church', 'Bishop D. L. Musoke'),
(2, 'Baptism', '1993-10-10', 'St. Mark Church', 'Revd. A. Namukasa'),
(3, 'Baptism', '1986-01-05', 'St. Mark Church', 'Revd. N. Kintu');

INSERT INTO role (name, description) VALUES
('Administrator', 'Full system access for administrators'),
('Parish Priest', 'Access to parish and sacrament records'),
('Treasurer', 'Access to financial reports and transaction entries');

INSERT INTO "user" (username, password_hash, role_id, assigned_unit_type, assigned_unit_id, email) VALUES
('admin', 'admin-hash', 1, 'Diocese', 1, 'admin@cou.org'),
('priest1', 'priest1-hash', 2, 'Parish', 1, 'priest1@cou.org'),
('treasurer1', 'treasurer1-hash', 3, 'Parish', 1, 'treasurer1@cou.org');

INSERT INTO transaction_record (unit_type, unit_id, transaction_date, amount, transaction_type, description) VALUES
('Parish', 1, '2026-03-01', 250000.00, 'Income', 'Sunday offertory'),
('Parish', 1, '2026-03-05', 120000.00, 'Expense', 'Church utilities'),
('Parish', 1, '2026-03-10', 50000.00, 'Income', 'Donation from members'),
('Parish', 2, '2026-03-08', 180000.00, 'Income', 'Youth fundraiser');
