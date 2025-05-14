# Business Rules & Special User Logic

## Authentication
- Only authenticated users (via Azure Entra) can access the app.
- User info (first name, last name, email) is extracted from the Entra token.

## User Display
- The UI displays the user's first and last name after login.

## Special User Logic
- If a user's first or last name starts with 'V', they are marked as special.
- Special users see a banner: "You are special and will receive $100 at the beginning of every month."
- At the start of each month, $100 is credited to special users' accounts automatically.

## Account Management
- Users can view their balance, credit, and debit their account.
- All business logic is protected by authentication and authorization middleware.
