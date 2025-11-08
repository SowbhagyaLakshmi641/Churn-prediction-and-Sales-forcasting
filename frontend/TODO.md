# TODO for Frontend Auth Integration

- [x] Create `src/components/ProtectedRoute.js` for auth protection
- [x] Update `src/components/Login.js` with API call to /api/auth/login, token storage, redirect to /churn on success
- [x] Update `src/components/Register.js` with API call to /api/auth/register, token storage, redirect to /churn on success (auto-login)
- [x] Update `src/App.js` to use ProtectedRoute for protected paths (/dashboard, /churn, /sales)
- [x] Test auth flow: register, login, redirect, protected access
