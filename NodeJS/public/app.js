document.addEventListener('DOMContentLoaded', () => {
  const balanceEl = document.getElementById('balance');
  const creditForm = document.getElementById('creditForm');
  const debitForm = document.getElementById('debitForm');
  const messageEl = document.getElementById('message');

  function showMessage(msg, type = 'success') {
    messageEl.textContent = msg;
    messageEl.className = `alert alert-${type}`;
    messageEl.classList.remove('d-none');
    setTimeout(() => messageEl.classList.add('d-none'), 2500);
  }

  function updateBalance() {
    fetch('/api/balance')
      .then(res => res.json())
      .then(data => {
        balanceEl.textContent = data.balance.toFixed(2);
      });
  }

  function showUserInfo() {
    fetch('/api/user', { headers: { 'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '' } })
      .then(res => res.json())
      .then(data => {
        document.getElementById('userName').textContent = `${data.firstName} ${data.lastName}`;
        const banner = document.getElementById('specialBanner');
        if (data.isSpecial) {
          banner.classList.remove('d-none');
        } else {
          banner.classList.add('d-none');
        }
      });
  }

  creditForm.addEventListener('submit', e => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('creditAmount').value);
    fetch('/api/credit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showMessage(data.error, 'danger');
        } else {
          showMessage('Amount credited!', 'success');
          updateBalance();
        }
      });
    creditForm.reset();
  });

  debitForm.addEventListener('submit', e => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('debitAmount').value);
    fetch('/api/debit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showMessage(data.error, 'danger');
        } else {
          showMessage('Amount debited!', 'success');
          updateBalance();
        }
      });
    debitForm.reset();
  });

  updateBalance();
  showUserInfo();
});
