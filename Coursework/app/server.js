const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const connectionString = process.env.DATABASE_URL;
let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

const defaultHouseholdId = process.env.DEFAULT_HOUSEHOLD_ID ? parseInt(process.env.DEFAULT_HOUSEHOLD_ID, 10) : 1;
const validUnitTypes = ['Diocese', 'Archdeaconry', 'Parish', 'SubParish'];
const validTransactionTypes = ['Income', 'Expense'];

const members = [
  {
    member_id: 1,
    first_name: 'John',
    last_name: 'Kato',
    phone: '0700123456',
    email: 'john.kato@example.com',
    membership_status: 'Active'
  }
];
let nextMemberId = 2;

const sacraments = [
  {
    sacrament_id: 1,
    member_id: 1,
    sacrament_type: 'Baptism',
    sacrament_date: '2022-08-14',
    location: 'St. Mark\'s Church',
    officiant: 'Revd. N. Kintu'
  }
];
let nextSacramentId = 2;

const transactions = [
  {
    transaction_id: 1,
    unit_type: 'Parish',
    unit_id: 1,
    transaction_date: '2024-03-01',
    amount: 150000.0,
    transaction_type: 'Income',
    description: 'Sunday offertory'
  }
];
let nextTransactionId = 2;

async function dbQuery(text, params = []) {
  if (!pool) {
    throw new Error('Database is not configured');
  }
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

app.get('/api/members', async (req, res) => {
  if (!pool) {
    return res.json(members);
  }

  try {
    const result = await dbQuery(
      'SELECT member_id, household_id, first_name, last_name, phone, email, membership_status FROM member ORDER BY member_id'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to fetch members.' });
  }
});

app.post('/api/members', async (req, res) => {
  const { first_name, last_name, phone, email, membership_status } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required.' });
  }

  if (!pool) {
    const newMember = {
      member_id: nextMemberId++,
      first_name,
      last_name,
      phone: phone || '',
      email: email || '',
      membership_status: membership_status || 'Active'
    };
    members.push(newMember);
    return res.status(201).json(newMember);
  }

  try {
    const result = await dbQuery(
      'INSERT INTO member (household_id, first_name, last_name, phone, email, membership_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING member_id, household_id, first_name, last_name, phone, email, membership_status',
      [defaultHouseholdId, first_name, last_name, phone || '', email || '', membership_status || 'Active']
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to create member.' });
  }
});

app.put('/api/members/:id', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const { first_name, last_name, phone, email, membership_status } = req.body;

  if (!pool) {
    const member = members.find(m => m.member_id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    member.first_name = first_name || member.first_name;
    member.last_name = last_name || member.last_name;
    member.phone = phone || member.phone;
    member.email = email || member.email;
    member.membership_status = membership_status || member.membership_status;
    return res.json(member);
  }

  try {
    const result = await dbQuery(
      'UPDATE member SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), phone = COALESCE($3, phone), email = COALESCE($4, email), membership_status = COALESCE($5, membership_status) WHERE member_id = $6 RETURNING member_id, household_id, first_name, last_name, phone, email, membership_status',
      [first_name, last_name, phone, email, membership_status, memberId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to update member.' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);

  if (!pool) {
    const index = members.findIndex(m => m.member_id === memberId);
    if (index === -1) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    members.splice(index, 1);
    return res.status(204).send();
  }

  try {
    const result = await dbQuery('DELETE FROM member WHERE member_id = $1', [memberId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to delete member.' });
  }
});

app.get('/api/sacraments', async (req, res) => {
  if (!pool) {
    return res.json(sacraments);
  }

  try {
    const result = await dbQuery(
      'SELECT sacrament_id, member_id, sacrament_type, sacrament_date, location, officiant FROM sacrament ORDER BY sacrament_id'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to fetch sacraments.' });
  }
});

app.post('/api/sacraments', async (req, res) => {
  const { member_id, sacrament_type, sacrament_date, location, officiant } = req.body;
  if (!member_id || !sacrament_type || !sacrament_date) {
    return res.status(400).json({ error: 'Member, sacrament type, and date are required.' });
  }

  if (!pool) {
    if (!members.find(m => m.member_id === parseInt(member_id, 10))) {
      return res.status(400).json({ error: 'Specified member does not exist.' });
    }
    const newSacrament = {
      sacrament_id: nextSacramentId++,
      member_id: parseInt(member_id, 10),
      sacrament_type,
      sacrament_date,
      location: location || '',
      officiant: officiant || ''
    };
    sacraments.push(newSacrament);
    return res.status(201).json(newSacrament);
  }

  try {
    const checkMember = await dbQuery('SELECT member_id FROM member WHERE member_id = $1', [member_id]);
    if (checkMember.rowCount === 0) {
      return res.status(400).json({ error: 'Specified member does not exist.' });
    }
    const result = await dbQuery(
      'INSERT INTO sacrament (member_id, sacrament_type, sacrament_date, location, officiant) VALUES ($1, $2, $3, $4, $5) RETURNING sacrament_id, member_id, sacrament_type, sacrament_date, location, officiant',
      [member_id, sacrament_type, sacrament_date, location || '', officiant || '']
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to create sacrament record.' });
  }
});

app.put('/api/sacraments/:id', async (req, res) => {
  const sacramentId = parseInt(req.params.id, 10);
  const { sacrament_type, sacrament_date, location, officiant } = req.body;

  if (!pool) {
    const sacrament = sacraments.find(s => s.sacrament_id === sacramentId);
    if (!sacrament) {
      return res.status(404).json({ error: 'Sacrament record not found.' });
    }
    sacrament.sacrament_type = sacrament_type || sacrament.sacrament_type;
    sacrament.sacrament_date = sacrament_date || sacrament.sacrament_date;
    sacrament.location = location || sacrament.location;
    sacrament.officiant = officiant || sacrament.officiant;
    return res.json(sacrament);
  }

  try {
    const result = await dbQuery(
      'UPDATE sacrament SET sacrament_type = COALESCE($1, sacrament_type), sacrament_date = COALESCE($2, sacrament_date), location = COALESCE($3, location), officiant = COALESCE($4, officiant) WHERE sacrament_id = $5 RETURNING sacrament_id, member_id, sacrament_type, sacrament_date, location, officiant',
      [sacrament_type, sacrament_date, location, officiant, sacramentId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sacrament record not found.' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to update sacrament record.' });
  }
});

app.delete('/api/sacraments/:id', async (req, res) => {
  const sacramentId = parseInt(req.params.id, 10);

  if (!pool) {
    const index = sacraments.findIndex(s => s.sacrament_id === sacramentId);
    if (index === -1) {
      return res.status(404).json({ error: 'Sacrament record not found.' });
    }
    sacraments.splice(index, 1);
    return res.status(204).send();
  }

  try {
    const result = await dbQuery('DELETE FROM sacrament WHERE sacrament_id = $1', [sacramentId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sacrament record not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to delete sacrament record.' });
  }
});

app.get('/api/transactions', async (req, res) => {
  if (!pool) {
    return res.json(transactions);
  }

  try {
    const result = await dbQuery(
      'SELECT transaction_id, unit_type, unit_id, transaction_date, amount, transaction_type, description FROM transaction_record ORDER BY transaction_id'
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to fetch transactions.' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const { unit_type, unit_id, transaction_date, amount, transaction_type, description } = req.body;
  if (!unit_type || !unit_id || !transaction_date || amount === undefined || !transaction_type) {
    return res.status(400).json({ error: 'Unit type, unit id, date, amount, and transaction type are required.' });
  }
  if (!validUnitTypes.includes(unit_type)) {
    return res.status(400).json({ error: 'Invalid unit type.' });
  }
  if (!validTransactionTypes.includes(transaction_type)) {
    return res.status(400).json({ error: 'Invalid transaction type.' });
  }
  const numericAmount = parseFloat(amount);
  if (Number.isNaN(numericAmount) || numericAmount < 0) {
    return res.status(400).json({ error: 'Amount must be a valid non-negative number.' });
  }

  if (!pool) {
    const newTransaction = {
      transaction_id: nextTransactionId++,
      unit_type,
      unit_id: parseInt(unit_id, 10),
      transaction_date,
      amount: numericAmount,
      transaction_type,
      description: description || ''
    };
    transactions.push(newTransaction);
    return res.status(201).json(newTransaction);
  }

  try {
    const result = await dbQuery(
      'INSERT INTO transaction_record (unit_type, unit_id, transaction_date, amount, transaction_type, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING transaction_id, unit_type, unit_id, transaction_date, amount, transaction_type, description',
      [unit_type, unit_id, transaction_date, numericAmount, transaction_type, description || '']
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to create transaction record.' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const { unit_type, unit_id, transaction_date, amount, transaction_type, description } = req.body;

  if (!pool) {
    const transaction = transactions.find(t => t.transaction_id === transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction record not found.' });
    }
    if (unit_type && validUnitTypes.includes(unit_type)) {
      transaction.unit_type = unit_type;
    }
    if (unit_id) {
      transaction.unit_id = parseInt(unit_id, 10);
    }
    if (transaction_date) {
      transaction.transaction_date = transaction_date;
    }
    if (amount) {
      const numericAmount = parseFloat(amount);
      if (!Number.isNaN(numericAmount) && numericAmount >= 0) {
        transaction.amount = numericAmount;
      }
    }
    if (transaction_type && validTransactionTypes.includes(transaction_type)) {
      transaction.transaction_type = transaction_type;
    }
    transaction.description = description || transaction.description;
    return res.json(transaction);
  }

  try {
    const result = await dbQuery(
      'UPDATE transaction_record SET unit_type = COALESCE($1, unit_type), unit_id = COALESCE($2, unit_id), transaction_date = COALESCE($3, transaction_date), amount = COALESCE($4, amount), transaction_type = COALESCE($5, transaction_type), description = COALESCE($6, description) WHERE transaction_id = $7 RETURNING transaction_id, unit_type, unit_id, transaction_date, amount, transaction_type, description',
      [unit_type, unit_id, transaction_date, amount, transaction_type, description, transactionId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction record not found.' });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to update transaction record.' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const transactionId = parseInt(req.params.id, 10);

  if (!pool) {
    const index = transactions.findIndex(t => t.transaction_id === transactionId);
    if (index === -1) {
      return res.status(404).json({ error: 'Transaction record not found.' });
    }
    transactions.splice(index, 1);
    return res.status(204).send();
  }

  try {
    const result = await dbQuery('DELETE FROM transaction_record WHERE transaction_id = $1', [transactionId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction record not found.' });
    }
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to delete transaction record.' });
  }
});

app.get('/api/summary', async (req, res) => {
  if (!pool) {
    const totalIncome = transactions.filter(t => t.transaction_type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.transaction_type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    return res.json({
      total_members: members.length,
      total_sacraments: sacraments.length,
      total_transactions: transactions.length,
      total_income: totalIncome,
      total_expense: totalExpense,
      net_balance: totalIncome - totalExpense
    });
  }

  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM member) AS total_members,
        (SELECT COUNT(*) FROM sacrament) AS total_sacraments,
        (SELECT COUNT(*) FROM transaction_record) AS total_transactions,
        COALESCE((SELECT SUM(amount) FROM transaction_record WHERE transaction_type = 'Income'), 0) AS total_income,
        COALESCE((SELECT SUM(amount) FROM transaction_record WHERE transaction_type = 'Expense'), 0) AS total_expense
    `;
    const result = await dbQuery(query);
    const stats = result.rows[0];
    return res.json({
      total_members: parseInt(stats.total_members, 10),
      total_sacraments: parseInt(stats.total_sacraments, 10),
      total_transactions: parseInt(stats.total_transactions, 10),
      total_income: parseFloat(stats.total_income),
      total_expense: parseFloat(stats.total_expense),
      net_balance: parseFloat(stats.total_income) - parseFloat(stats.total_expense)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to fetch summary.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CoU-MIS prototype is running.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CoU-MIS prototype server running on port ${PORT}`);
});
