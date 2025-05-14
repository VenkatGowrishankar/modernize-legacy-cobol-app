# Module Flow Diagram

```mermaid
flowchart TD
    UI["Bootstrap UI<br/>(public/index.html)"]
    API["Express API<br/>(server.js)"]
    Store["In-memory Store<br/>(store.js)"]
    Auth["Azure Entra Authentication"]

    UI -- "REST calls" --> API
    API -- "Auth check" --> Auth
    API -- "Business logic" --> Store
    Store -- "Data" --> API
    API -- "JSON response" --> UI
```

## Explanation
- The UI interacts with the API via REST endpoints.
- All API requests are authenticated using Azure Entra.
- The API delegates business logic to the in-memory store.
- Data flows back to the UI as JSON responses.
