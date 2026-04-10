-- Sample advanced SQL queries for CoU-MIS

-- 1. List members with their household and parish
SELECT
    m.member_id,
    m.first_name,
    m.last_name,
    h.household_name,
    sp.name AS subparish_name,
    p.name AS parish_name
FROM member m
JOIN household h ON m.household_id = h.household_id
JOIN subparish sp ON h.subparish_id = sp.subparish_id
JOIN parish p ON sp.parish_id = p.parish_id;

-- 2. Count members per parish
SELECT
    p.parish_id,
    p.name AS parish_name,
    COUNT(m.member_id) AS member_count
FROM parish p
JOIN subparish sp ON sp.parish_id = p.parish_id
JOIN household h ON h.subparish_id = sp.subparish_id
JOIN member m ON m.household_id = h.household_id
GROUP BY p.parish_id, p.name
ORDER BY member_count DESC;

-- 3. Find sacraments for members confirmed in the last 12 months
SELECT
    s.sacrament_id,
    s.sacrament_type,
    s.sacrament_date,
    m.first_name,
    m.last_name
FROM sacrament s
JOIN member m ON s.member_id = m.member_id
WHERE s.sacrament_type = 'Confirmation'
  AND s.sacrament_date >= CURRENT_DATE - INTERVAL '12 months';

-- 4. Total income and expense for each archdeaconry using subquery
SELECT
    a.archdeaconry_id,
    a.name,
    (SELECT COALESCE(SUM(amount), 0)
     FROM transaction_record t
     WHERE t.unit_type = 'Archdeaconry' AND t.unit_id = a.archdeaconry_id AND t.transaction_type = 'Income') AS total_income,
    (SELECT COALESCE(SUM(amount), 0)
     FROM transaction_record t
     WHERE t.unit_type = 'Archdeaconry' AND t.unit_id = a.archdeaconry_id AND t.transaction_type = 'Expense') AS total_expense
FROM archdeaconry a;

-- 5. View data from parish financial summary
SELECT * FROM parish_financial_summary;

-- 6. Advanced join with diocesan roll-up totals
SELECT
    d.diocese_id,
    d.name AS diocese_name,
    SUM(CASE WHEN t.transaction_type = 'Income' THEN t.amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN t.transaction_type = 'Expense' THEN t.amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN t.transaction_type = 'Income' THEN t.amount ELSE 0 END) - SUM(CASE WHEN t.transaction_type = 'Expense' THEN t.amount ELSE 0 END) AS net_balance
FROM diocese d
JOIN archdeaconry a ON a.diocese_id = d.diocese_id
JOIN parish p ON p.archdeaconry_id = a.archdeaconry_id
JOIN transaction_record t ON t.unit_type = 'Parish' AND t.unit_id = p.parish_id
GROUP BY d.diocese_id, d.name;
