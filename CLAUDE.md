# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Readit is a Reddit-like social platform with GitHub OAuth authentication, Cloudinary media uploads (images and videos), post likes, and user subscriptions. It has two independent services:

- **Backend**: Deno + Hono framework, MongoDB, runs on port 8080
- **Frontend**: React 19 + Vite + TypeScript, MUI components + Tailwind CSS, runs on port 5173

## Development Commands

### Backend (Deno)
```bash
cd backend
deno task dev                             # run with file-watching
deno test --allow-net test/readit_test.ts # run integration tests (requires live MongoDB)
deno test --filter "test name"            # run a single test by name
```

Backend requires environment variables:
- `AUTH_CLIENT_ID` — GitHub OAuth app client ID
- `AUTH_CLIENT_SECRET` — GitHub OAuth app client secret

And a local MongoDB instance at `mongodb://127.0.0.1:27017` with a `readit` database containing `feed-data` and `users-data` collections.

### Frontend (npm/Node)
```bash
cd frontend
npm run dev            # start Vite dev server
npm run build          # tsc + vite build
npm run lint           # ESLint
```

## Architecture

### Auth Flow
GitHub OAuth is handled entirely by the backend. `GET /get/handleAuthLogin` redirects to GitHub; GitHub redirects back to `GET /auth`, which exchanges the code for a token, fetches the GitHub user profile, upserts the user in MongoDB, and sets a `user_id` cookie. The frontend detects login state on mount via `GET /get/checkUser`.

### Backend Structure
- `backend/src/persistence.ts` — creates MongoDB client and resolves the next auto-increment `_id` for posts and users
- `backend/src/readit.ts` — `Readit` class: wraps the posts collection (CRUD, likes, cursor-based pagination)
- `backend/src/user.ts` — `User` class: wraps the users collection (upsert, subscribers)
- `backend/src/handlers.ts` — one handler function per route; reads `postsClass`/`usersClass` from Hono context
- `backend/src/helpers.ts` — GitHub OAuth helpers, cookie access (`user_id` cookie), data formatting
- `backend/src/app.ts` — wires CORS (origin: `http://localhost:5173`), logger, context injection, and routes

Both `Readit` and `User` classes use MongoDB directly as the persistence layer; `_id` is a numeric auto-increment managed in-memory, seeded from the highest `_id` in the collection on startup. This means both classes must remain as singletons — reinstantiating them resets the counter.

### Data Shapes
Posts (`feed-data` collection):
```ts
{ _id: number, userId: number, user: string, date: string, title: string,
  description: string, image: string, likes: number, likedUsers: number[] }
```
Users (`users-data` collection):
```ts
{ _id: number, user: string, subscribers: number[] }
```

### Frontend Structure
- `App.tsx` — root; calls `checkUserLogin` on mount, renders `<Login>` or `<Home>` based on state; exports `UserContext` (provides the logged-in username string)
- `main-pages.tsx` — `Home` page: orchestrates infinite scroll feed, post mutations, user subscriptions, FAB navigation (Home / Add Post)
- `feed.tsx` — pure presentational `Feed` and `PostArticle` components
- `form-creation.tsx` — `FormCreation`: tabbed text/media post form; reads username via `useContext(UserContext)`; uploads image or video to Cloudinary on file select (videos validated ≤ 5 min before upload), stores the resulting URL, then includes it in the post body on submit
- `search-label.tsx` — `SearchLabel`: top AppBar with user search and subscribe/unsubscribe UI
- `api.tsx` — all `fetch` calls to the backend (hardcoded `http://localhost:8080`)
- `reducers/login-reducer.tsx` — login state via `useReducer` + immer
- `reducers/search-reducer.tsx` — subscriber list state
- `feed-data.tsx` — static mock fixture data; not used in production

Note: `frontend/src/search-reducer.tsx` is a stale duplicate of `frontend/src/reducers/search-reducer.tsx`; the one under `reducers/` is the one actually imported by the app.

### Data Flow for Posts
Posts use TanStack Query's `useInfiniteQuery` with cursor-based pagination (cursor = number of posts already fetched, limit = 5). The feed endpoint is `POST /post/feedInfo` (body: `{ cursor, limit }`). Mutations (add, delete, like, unlike) invalidate the `["posts"]` query key on success. Media (image or video) uploads go directly from the browser to Cloudinary's upload API (cloud: `du6mwwqgr`, preset: `readit`); images use `/image/upload`, videos use `/video/upload`. Only the returned `secure_url` is stored in the `image` field in MongoDB. `feed.tsx` detects video posts by checking if the URL contains `/video/upload/` and renders `<video>` vs `<img>` accordingly.

### CORS
Backend CORS is pinned to `http://localhost:5173`. All fetch calls from the frontend use `credentials: "include"` for the session cookie. The GitHub OAuth redirect URI is hardcoded to `http://localhost:8080/auth`.
