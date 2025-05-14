const store = require('../store');

describe('Account Store', () => {
  beforeEach(() => {
    store.setBalance(1000);
  });

  test('initial balance is 1000.00', () => {
    expect(store.getBalance()).toBeCloseTo(1000.00);
  });

  test('credit increases balance', () => {
    store.credit(200);
    expect(store.getBalance()).toBeCloseTo(1200.00);
  });

  test('debit decreases balance if sufficient funds', () => {
    store.debit(300);
    expect(store.getBalance()).toBeCloseTo(700.00);
  });

  test('debit fails if insufficient funds', () => {
    const result = store.debit(2000);
    expect(result).toBe(false);
    expect(store.getBalance()).toBeCloseTo(1000.00);
  });

  test('credit with negative amount does not change balance', () => {
    store.credit(-100);
    expect(store.getBalance()).toBeCloseTo(1000.00);
  });

  test('debit with negative amount does not change balance', () => {
    store.debit(-100);
    expect(store.getBalance()).toBeCloseTo(1000.00);
  });

  test('creditSpecialUserIfNeeded credits $100 for special user at new month', () => {
    const specialUser = { firstName: 'Victor', lastName: 'Smith' };
    store.creditSpecialUserIfNeeded(specialUser);
    expect(store.getBalance()).toBeCloseTo(1100.00);
  });

  test('creditSpecialUserIfNeeded does not credit for normal user', () => {
    const normalUser = { firstName: 'Alice', lastName: 'Brown' };
    store.creditSpecialUserIfNeeded(normalUser);
    expect(store.getBalance()).toBeCloseTo(1000.00);
  });
});
