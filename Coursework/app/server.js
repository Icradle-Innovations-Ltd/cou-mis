const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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
    amount: 150000.00,
    transaction_type: 'Income',
    description: 'Sunday offertory'
  }
];
let nextTransactionId = 2;

const validUnitTypes = ['Diocese', 'Archdeaconry', 'Parish', 'SubParish'];
const validTransactionTypes = ['Income', 'Expense'];

app.get('/api/members', (req, res) => {
  res.json(members);
});

app.post('/api/members', (req, res) => {
  const { first_name, last_name, phone, email, membership_status } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'First name and last name are required.' });
  }
  const newMember = {
    member_id: nextMemberId++,
    first_name,
    last_name,
    phone: phone || '',
    email: email || '',
    membership_status: membership_status || 'Active'
  };
  members.push(newMember);
  res.status(201).json(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const member = members.find(m => m.member_id === memberId);
  if (!member) {
    return res.status(404).json({ error: 'Member not found.' });
  }
  const { first_name, last_name, phone, email, membership_status } = req.body;
  member.first_name = first_name || member.first_name;
  member.last_name = last_name || member.last_name;
  member.phone = phone || member.phone;
  member.email = email || member.email;
  member.membership_status = membership_status || member.membership_status;
  res.json(member);
});

app.delete('/api/members/:id', (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const index = members.findIndex(m => m.member_id === memberId);
  if (index === -1) {
    return res.status(404).json({ error: 'Member not found.' });
  }
  members.splice(index, 1);
  res.status(204).send();
});

app.get('/api/sacraments', (req, res) => {
  res.json(sacraments);
});

app.post('/api/sacraments', (req, res) => {
  const { member_id, sacrament_type, sacrament_date, location, officiant } = req.body;
  if (!member_id || !sacrament_type || !sacrament_date) {
    return res.status(400).json({ error: 'Member, sacrament type, and date are required.' });
  }
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
  res.status(201).json(newSacrament);
});

app.put('/api/sacraments/:id', (req, res) => {
  const sacramentId = parseInt(req.params.id, 10);
  const sacrament = sacraments.find(s => s.sacrament_id === sacramentId);
  if (!sacrament) {
    return res.status(404).json({ error: 'Sacrament record not found.' });
  }
  const { sacrament_type, sacrament_date, location, officiant } = req.body;
  sacrament.sacrament_type = sacrament_type || sacrament.sacrament_type;
  sacrament.sacrament_date = sacrament_date || sacrament.sacrament_date;
  sacrament.location = location || sacrament.location;
  sacrament.officiant = officiant || sacrament.officiant;
  res.json(sacrament);
});

app.delete('/api/sacraments/:id', (req, res) => {
  const sacramentId = parseInt(req.params.id, 10);
  const index = sacraments.findIndex(s => s.sacrament_id === sacramentId);
  if (index === -1) {
    return res.status(404).json({ error: 'Sacrament record not found.' });
  }
  sacraments.splice(index, 1);
  res.status(204).send();
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

app.post('/api/transactions', (req, res) => {
  const { unit_type, unit_id, transaction_date, amount, transaction_type, description } = req.body;
  if (!unit_type || !unit_id || !transaction_date || !amount || !transaction_type) {
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
  res.status(201).json(newTransaction);
});

app.put('/api/transactions/:id', (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const transaction = transactions.find(t => t.transaction_id === transactionId);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction record not found.' });
  }
  const { unit_type, unit_id, transaction_date, amount, transaction_type, description } = req.body;
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
  res.json(transaction);
});

app.delete('/api/transactions/:id', (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const index = transactions.findIndex(t => t.transaction_id === transactionId);
  if (index === -1) {
    return res.status(404).json({ error: 'Transaction record not found.' });
  }
  transactions.splice(index, 1);
  res.status(204).send();
});

app.get('/api/summary', (req, res) => {
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.transaction_type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  res.json({
    total_members: members.length,
    total_sacraments: sacraments.length,
    total_transactions: transactions.length,
    total_income: totalIncome,
    total_expense: totalExpense,
    net_balance: totalIncome - totalExpense
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CoU-MIS prototype is running.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CoU-MIS prototype server running on http://localhost:${PORT}`);
});
