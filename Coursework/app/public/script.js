const memberForm = document.getElementById('member-form');
const sacramentForm = document.getElementById('sacrament-form');
const transactionForm = document.getElementById('transaction-form');
const memberTable = document.getElementById('member-table');
const sacramentTable = document.getElementById('sacrament-table');
const transactionTable = document.getElementById('transaction-table');
const memberSelect = document.getElementById('sacrament_member_id');
const summaryMembers = document.getElementById('summary-members');
const summarySacraments = document.getElementById('summary-sacraments');
const summaryNet = document.getElementById('summary-net');
const resetMemberButton = document.getElementById('reset-member');
const resetSacramentButton = document.getElementById('reset-sacrament');
const resetTransactionButton = document.getElementById('reset-transaction');

async function apiFetch(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }
  return response.json();
}

async function loadMembers() {
  const members = await apiFetch('/api/members');
  memberTable.innerHTML = '';
  memberSelect.innerHTML = '<option value="" disabled selected>Select member</option>';
  members.forEach(member => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${member.member_id}</td>
      <td>${member.first_name} ${member.last_name}</td>
      <td>${member.phone || ''}</td>
      <td>${member.membership_status}</td>
      <td>
        <button onclick="editMember(${member.member_id})">Edit</button>
        <button onclick="deleteMember(${member.member_id})">Delete</button>
      </td>
    `;
    memberTable.appendChild(row);
    const option = document.createElement('option');
    option.value = member.member_id;
    option.textContent = `${member.first_name} ${member.last_name}`;
    memberSelect.appendChild(option);
  });
  updateSummary();
}

async function loadSacraments() {
  const sacraments = await apiFetch('/api/sacraments');
  sacramentTable.innerHTML = '';
  sacraments.forEach(s => {
    const row = document.createElement('tr');
    const memberName = memberSelect.querySelector(`option[value="${s.member_id}"]`)?.textContent || `Member ${s.member_id}`;
    row.innerHTML = `
      <td>${s.sacrament_id}</td>
      <td>${memberName}</td>
      <td>${s.sacrament_type}</td>
      <td>${s.sacrament_date}</td>
      <td>
        <button onclick="editSacrament(${s.sacrament_id})">Edit</button>
        <button onclick="deleteSacrament(${s.sacrament_id})">Delete</button>
      </td>
    `;
    sacramentTable.appendChild(row);
  });
  updateSummary();
}

async function loadTransactions() {
  const transactions = await apiFetch('/api/transactions');
  transactionTable.innerHTML = '';
  transactions.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.transaction_id}</td>
      <td>${t.unit_type} ${t.unit_id}</td>
      <td>${t.transaction_type}</td>
      <td>${formatCurrency(t.amount)}</td>
      <td>${t.transaction_date}</td>
      <td>
        <button onclick="editTransaction(${t.transaction_id})">Edit</button>
        <button onclick="deleteTransaction(${t.transaction_id})">Delete</button>
      </td>
    `;
    transactionTable.appendChild(row);
  });
  updateSummary();
}

async function updateSummary() {
  const summary = await apiFetch('/api/summary');
  summaryMembers.textContent = summary.total_members;
  summarySacraments.textContent = summary.total_sacraments;
  summaryNet.textContent = formatCurrency(summary.net_balance);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(value);
}

async function deleteMember(id) {
  await apiFetch(`/api/members/${id}`, { method: 'DELETE' });
  await refreshAll();
}

async function deleteSacrament(id) {
  await apiFetch(`/api/sacraments/${id}`, { method: 'DELETE' });
  await refreshAll();
}

async function deleteTransaction(id) {
  await apiFetch(`/api/transactions/${id}`, { method: 'DELETE' });
  await refreshAll();
}

window.editMember = async function (id) {
  const members = await apiFetch('/api/members');
  const member = members.find(m => m.member_id === id);
  if (!member) return;
  document.getElementById('member_id').value = member.member_id;
  document.getElementById('first_name').value = member.first_name;
  document.getElementById('last_name').value = member.last_name;
  document.getElementById('phone').value = member.phone;
  document.getElementById('email').value = member.email;
  document.getElementById('membership_status').value = member.membership_status;
};

window.editSacrament = async function (id) {
  const sacraments = await apiFetch('/api/sacraments');
  const sacrament = sacraments.find(s => s.sacrament_id === id);
  if (!sacrament) return;
  document.getElementById('sacrament_id').value = sacrament.sacrament_id;
  document.getElementById('sacrament_member_id').value = sacrament.member_id;
  document.getElementById('sacrament_type').value = sacrament.sacrament_type;
  document.getElementById('sacrament_date').value = sacrament.sacrament_date;
  document.getElementById('sacrament_location').value = sacrament.location;
  document.getElementById('sacrament_officiant').value = sacrament.officiant;
};

window.editTransaction = async function (id) {
  const transactions = await apiFetch('/api/transactions');
  const transaction = transactions.find(t => t.transaction_id === id);
  if (!transaction) return;
  document.getElementById('transaction_id').value = transaction.transaction_id;
  document.getElementById('transaction_unit_type').value = transaction.unit_type;
  document.getElementById('transaction_unit_id').value = transaction.unit_id;
  document.getElementById('transaction_date').value = transaction.transaction_date;
  document.getElementById('transaction_amount').value = transaction.amount;
  document.getElementById('transaction_type').value = transaction.transaction_type;
  document.getElementById('transaction_description').value = transaction.description;
};

memberForm.addEventListener('submit', async event => {
  event.preventDefault();
  const memberId = document.getElementById('member_id').value;
  const payload = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    membership_status: document.getElementById('membership_status').value
  };
  try {
    if (memberId) {
      await apiFetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await apiFetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    memberForm.reset();
    await refreshAll();
  } catch (error) {
    alert(error.message);
  }
});

sacramentForm.addEventListener('submit', async event => {
  event.preventDefault();
  const sacramentId = document.getElementById('sacrament_id').value;
  const payload = {
    member_id: document.getElementById('sacrament_member_id').value,
    sacrament_type: document.getElementById('sacrament_type').value,
    sacrament_date: document.getElementById('sacrament_date').value,
    location: document.getElementById('sacrament_location').value,
    officiant: document.getElementById('sacrament_officiant').value
  };
  try {
    if (sacramentId) {
      await apiFetch(`/api/sacraments/${sacramentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await apiFetch('/api/sacraments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    sacramentForm.reset();
    await refreshAll();
  } catch (error) {
    alert(error.message);
  }
});

transactionForm.addEventListener('submit', async event => {
  event.preventDefault();
  const transactionId = document.getElementById('transaction_id').value;
  const payload = {
    unit_type: document.getElementById('transaction_unit_type').value,
    unit_id: document.getElementById('transaction_unit_id').value,
    transaction_date: document.getElementById('transaction_date').value,
    amount: document.getElementById('transaction_amount').value,
    transaction_type: document.getElementById('transaction_type').value,
    description: document.getElementById('transaction_description').value
  };
  try {
    if (transactionId) {
      await apiFetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await apiFetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    transactionForm.reset();
    await refreshAll();
  } catch (error) {
    alert(error.message);
  }
});

resetMemberButton.addEventListener('click', () => memberForm.reset());
resetSacramentButton.addEventListener('click', () => sacramentForm.reset());
resetTransactionButton.addEventListener('click', () => transactionForm.reset());

async function refreshAll() {
  await loadMembers();
  await loadSacraments();
  await loadTransactions();
}

refreshAll();
