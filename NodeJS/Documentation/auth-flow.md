# Azure Entra Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Entra as AzureEntraID

    User->>UI: Access App
    UI->>API: Request (with token)
    API->>AzureEntraID: Validate Token
    AzureEntraID-->>API: User Info (firstName, lastName, email)
    API-->>UI: Allow or Deny Access
    API-->>UI: Display User Info
    API-->>UI: Show Special Banner if user is special
```

## Steps
1. User logs in via Azure Entra (Microsoft Identity platform).
2. The UI sends the access token with each API request.
3. The API validates the token and extracts user info.
4. Only authenticated users can access the app.
5. The UI displays the user's first and last name.
6. If the user's name starts with 'V', a special banner is shown and $100 is credited at the start of each month.
