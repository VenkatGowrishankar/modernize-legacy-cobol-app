# Node.js Account Management System

This project is a modernized version of a legacy COBOL account management system. It features:

- Node.js backend with Express
- In-memory data store for account balance
- REST API for all business logic
- Clean, responsive UI using Bootstrap
- Unit tests for business logic

## Getting Started

### Install dependencies

```bash
npm install
```

### Run tests

```bash
npm test
```

### Start the app

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Project Structure
- `server.js` - Express server and API endpoints
- `store.js` - In-memory data store and business logic
- `public/` - Static files (HTML, CSS, Bootstrap UI)
- `tests/` - Unit and integration tests

## API Endpoints
- `GET /api/balance` - Get current balance
- `POST /api/credit` - Credit account
- `POST /api/debit` - Debit account

## License
MIT
