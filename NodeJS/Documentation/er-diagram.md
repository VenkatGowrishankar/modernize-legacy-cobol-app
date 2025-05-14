# Entity-Relationship Diagram

```mermaid
erDiagram
    USER {
        string id
        string firstName
        string lastName
        string email
        boolean isSpecial
    }
    ACCOUNT {
        float balance
        string userId
    }
    USER ||--o| ACCOUNT : owns
```

## Explanation
- Each user has an account (1:1 relationship).
- The `isSpecial` flag is set for users whose first or last name starts with 'V'.
- The account stores the balance for each user.
