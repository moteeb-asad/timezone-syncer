# Timezone Syncer

Manage and compare timezones for remote teams, with working-hours cues and premium unlocks.

## How it works

- Public routes (home/login) and protected routes (dashboard/premium/account) via `ProtectedRoute`/`PublicRoute` guards.
- `Layout` wraps routes with a shared navbar/footer; content renders through `Outlet`.
- `TimezoneManager` handles base time, timezone list, add/remove, upgrade prompts; logic lives in `hooks/timezone/useTimezoneManager`.
- Auth (login/register/logout) via Firebase in `hooks/auth/useAuth`; redirects back to the originally requested page after login.

## Stack

- React + TypeScript + Vite
- React Router v7 guards
- Redux Toolkit store
- Tailwind CSS
- Firebase Auth

## Setup

1. Install deps: `npm install`
2. Env: create `.env.local` with your Firebase keys:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

3. Run dev server: `npm run dev` (Node 20.19+ recommended for Vite 7.3+)
4. Build: `npm run build` · Lint: `npm run lint`

## Folders (high level)

- `src/components/`
  - `auth/` (guards) · `layout/` (shell) · `timezone/` (UI pieces)
- `src/hooks/` → `auth/`, `timezone/`
- `src/routes/` (route config)
- `src/pages/` (Login, Premium)
- `src/slices/` (Redux)
- `src/types/`, `src/utils/`, `src/styles/`

## What problem it solves

Quickly see multiple teammates’ timezones, track working hours, and share a simple dashboard—reducing back-and-forth when scheduling across regions.
