# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
```bash
npm run dev        # Start Vite dev server (default: http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

No test runner is configured.

## Architecture

React 19 SPA (JavaScript, no TypeScript) built with Vite. Material-UI for components, React Router DOM 7 for routing.

### Layer structure

- `src/pages/` — Full-page components (`Login.jsx`, `Chat.jsx`)
- `src/components/` — Reusable components (`ProtectedRoute.jsx`)
- `src/services/` — API layer: `api.js` (Axios client), `authService.js`, `chatService.js`
- `src/contexts/` — React Context: `ToastContext.jsx` (global toast notifications via `useToast()`)
- `src/utils/` — `auth.js` (localStorage token management), `jwtDecoder.js` (JWT parsing)
- `src/config/env.js` — Environment config

### Routing

Defined in `App.jsx`. Two routes: `/login` (public) and `/` (protected via `ProtectedRoute`). Catch-all redirects to `/`.

### Authentication

JWT tokens (`accessToken`, `refreshToken`, `expiresAt`) stored in `localStorage`. The Axios client in `api.js` auto-attaches the Bearer token on every request and handles silent token refresh on 401 responses before falling back to redirecting to `/login`.

### State management

No global state library. Component-local `useState` for everything except notifications, which use `ToastContext` (`showSuccess()` / `showError()`). MUI `ThemeProvider` wraps the app in `App.jsx`.

### Environment

Backend URL configured via `VITE_API_BASE_URL` in `.env` (default: `http://localhost:7551`). All Vite env vars must be prefixed with `VITE_`.

## Backend API

REST API running at `http://localhost:7551`. Swagger UI available at `http://localhost:7551/swagger/index.html`. Always HTTP — never HTTPS.

### Auth endpoints
- `POST /api/Auth/login` — body: `{ username, password }` → returns `{ accessToken, refreshToken, expiresAt }`
- `POST /api/Auth/refresh` — body: `{ refreshToken }` → returns `{ accessToken, refreshToken, expiresAt }`

### Response contracts
- All tokens are strings. `expiresAt` is a .NET `DateTime` serialized as ISO 8601.
- JSON is camelCase (default .NET serialization). Frontend guards for both camelCase and PascalCase.
- Errors follow ASP.NET `ProblemDetails` shape: `{ title, status }`. Validation errors use `ValidationProblemDetails`: `{ errors: { field: [messages] } }`.

## Code conventions

- **No TypeScript** — plain JavaScript only. Do not add `.ts` or `.tsx` files.
- **No test files** — no test runner is configured, do not generate test files.
- **MUI only** — use Material-UI components for all UI. Do not introduce other UI libraries.
- **HTTP only** — never use HTTPS for local API calls. The backend does not support it.
- **Error handling** — all errors must go through `showError()` from `useToast()`. Never use `alert()` or `console.error()` as the sole error output.
- **Auth flow** — never bypass `ProtectedRoute`. Any new page that requires authentication must be wrapped with it in `App.jsx`.
- **Service layer** — all API calls must live in `src/services/`. Pages and components must never call `apiClient` directly.
- **English only** — all UI text, comments, variable names, and labels must be in English.