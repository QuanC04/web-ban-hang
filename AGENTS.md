# AGENTS.md

## Overview
- Repo includes `fe/` for the Vite React frontend and `be/` for the Express TypeScript backend.
- Keep changes small and task-focused. Avoid unrelated refactors.
- When changing API contracts, update both frontend and backend in the same change.

## Run Commands
- Frontend dev: `npm run dev` in `fe/`
- Frontend build: `npm run build` in `fe/`
- Frontend lint: `npm run lint` in `fe/`
- Backend dev: `npm run dev` in `be/`

## Frontend Notes
- Stack: React 19, TypeScript, Vite, TanStack Router, Zustand, Axios.
- API clients live in `fe/src/api/`.
- `privateClient` is for authenticated requests and attaches the access token from cookies.
- Auth state is split between cookies and Zustand store, so changes to login/logout should keep both in sync.

## Backend Notes
- Stack: Express, TypeScript, Prisma, MariaDB, JWT.
- Auth module lives in `be/src/modules/auth/`.
- Middleware lives in `be/src/middleware/`.
- Be careful to keep JWT signing and verification secrets consistent across services and middleware.

## Auth Rules
- Access token is stored in cookie key `token`.
- Refresh token is stored in cookie key `refreshToken`.
- Refresh flow uses token rotation: backend verifies the submitted refresh token, compares it with `user.refresh_token` in DB, then issues and stores a new refresh token.
- Logout should revoke the refresh token in DB, not only clear cookies on the client.
- Keep the refresh request body field name consistent between frontend and backend.

## Verification Checklist
- Login returns `accessToken`, `refreshToken`, and user data.
- Authenticated requests include `Authorization: Bearer <accessToken>`.
- When an access token expires, one refresh request is sent and queued requests are retried after success.
- Invalid refresh token clears auth cookies and redirects to `/login`.
- Logout invalidates the server-side refresh token and clears client auth state.

## Editing Guidance
- Prefer `publicClient` only for unauthenticated endpoints.
- Prefer `privateClient` for protected endpoints.
- Guard Axios error handling for cases where `error.response` is missing.
- Do not introduce new auth storage mechanisms unless there is a clear requirement.
