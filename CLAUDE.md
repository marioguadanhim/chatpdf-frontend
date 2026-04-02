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
