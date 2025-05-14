const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const store = require('./store');
const requireAuth = require('./requireAuth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(requireAuth);

// API Endpoints
app.get('/api/balance', (req, res) => {
  store.creditSpecialUserIfNeeded(req.user);
  res.json({ balance: store.getBalance() });
});

app.post('/api/credit', (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ error: 'Invalid credit amount.' });
  }
  store.credit(amount);
  res.json({ balance: store.getBalance() });
});

app.post('/api/debit', (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount < 0) {
    return res.status(400).json({ error: 'Invalid debit amount.' });
  }
  const success = store.debit(amount);
  if (!success) {
    return res.status(400).json({ error: 'Insufficient funds.' });
  }
  res.json({ balance: store.getBalance() });
});

app.get('/api/user', (req, res) => {
  const { firstName, lastName } = req.user;
  const isSpecial = firstName?.startsWith('V') || lastName?.startsWith('V');
  res.json({ firstName, lastName, isSpecial });
});

// Fallback to index.html for non-API, non-static requests
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
