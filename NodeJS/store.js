let balance = 1000.00;

function getBalance() {
  return parseFloat(balance.toFixed(2));
}

function credit(amount) {
  if (typeof amount === 'number' && amount >= 0) {
    balance += amount;
    return true;
  }
  return false;
}

function debit(amount) {
  if (typeof amount === 'number' && amount >= 0 && balance >= amount) {
    balance -= amount;
    return true;
  }
  return false;
}

function setBalance(val) {
  balance = val;
}

let creditedMonth = null;
function creditSpecialUserIfNeeded(user) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const isSpecial = user.firstName?.startsWith('V') || user.lastName?.startsWith('V');
  if (isSpecial && creditedMonth !== monthKey) {
    credit(100);
    creditedMonth = monthKey;
  }
}

module.exports = { getBalance, credit, debit, setBalance, creditSpecialUserIfNeeded };
