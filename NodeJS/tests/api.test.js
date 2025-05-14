const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const store = require('../store');
const requireAuth = require('../requireAuth');

// Helper to mock authentication for tests
function mockAuth(user) {
  return (req, res, next) => {
    req.user = user;
    next();
  };
}

const specialUser = { firstName: 'Victor', lastName: 'Smith', email: 'victor@example.com' };
const normalUser = { firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com' };

const app = express();
app.use(bodyParser.json());

app.get('/api/balance', (req, res) => {
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

describe('API Endpoints', () => {
  let app;
  beforeEach(() => {
    store.setBalance(1000);
    app = express();
    app.use(bodyParser.json());
  });

  test('GET /api/balance returns current balance', async () => {
    app.use(mockAuth(normalUser));
    app.get('/api/balance', (req, res) => {
      res.json({ balance: store.getBalance() });
    });
    const res = await request(app).get('/api/balance');
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBeCloseTo(1000.00);
  });

  test('POST /api/credit credits the account', async () => {
    app.use(mockAuth(normalUser));
    app.post('/api/credit', (req, res) => {
      const { amount } = req.body;
      if (typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({ error: 'Invalid credit amount.' });
      }
      store.credit(amount);
      res.json({ balance: store.getBalance() });
    });
    const res = await request(app).post('/api/credit').send({ amount: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBeCloseTo(1100.00);
  });

  test('POST /api/debit debits the account', async () => {
    app.use(mockAuth(normalUser));
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
    const res = await request(app).post('/api/debit').send({ amount: 200 });
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBeCloseTo(800.00);
  });

  test('POST /api/debit fails if insufficient funds', async () => {
    app.use(mockAuth(normalUser));
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
    const res = await request(app).post('/api/debit').send({ amount: 2000 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Insufficient funds.');
  });

  test('POST /api/credit fails with negative amount', async () => {
    app.use(mockAuth(normalUser));
    app.post('/api/credit', (req, res) => {
      const { amount } = req.body;
      if (typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({ error: 'Invalid credit amount.' });
      }
      store.credit(amount);
      res.json({ balance: store.getBalance() });
    });
    const res = await request(app).post('/api/credit').send({ amount: -50 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid credit amount.');
  });

  test('GET /api/balance credits $100 for special user at new month', async () => {
    app.use(mockAuth(specialUser));
    app.get('/api/balance', (req, res) => {
      store.creditSpecialUserIfNeeded(req.user);
      res.json({ balance: store.getBalance() });
    });
    const res = await request(app).get('/api/balance');
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBeCloseTo(1100.00);
  });

  test('GET /api/balance does not credit $100 for normal user', async () => {
    app.use(mockAuth(normalUser));
    app.get('/api/balance', (req, res) => {
      store.creditSpecialUserIfNeeded(req.user);
      res.json({ balance: store.getBalance() });
    });
    const res = await request(app).get('/api/balance');
    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBeCloseTo(1000.00);
  });
});
