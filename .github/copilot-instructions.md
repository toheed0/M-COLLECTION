## Quick context (what this repo is)

- Monorepo-style workspace with two main parts: `backend/` (Express + Mongoose API) and `frontend/` (React + Vite SPA).
- Backend exposes REST endpoints under `/api/*`. Authentication uses JWT and a `protect` middleware that attaches `req.user`.

## How to run (common developer flows)

- Backend (from repo root):
  - Open a terminal, cd into `backend/` and install deps then run dev server with nodemon:

    ```powershell
    cd backend; npm install; npm run dev
    ```

  - Required env vars: at minimum set `MONGODB_URL` and `JWT_SECRET` (server uses `dotenv`). Optionally set `PORT`.

- Frontend (from repo root):

    ```powershell
    cd frontend; npm install; npm run dev
    ```

- There is no top-level orchestration script; run frontend and backend in separate terminals.

## Key files & where to look for common tasks

- Backend entry: `backend/server.js` — loads env, connects DB (`backend/config/db.js`) and registers routes. Note: currently `server.js` only mounts `userRoutes` (`app.use('/api/users', ...)`).
- Routes: `backend/routes/*.js` (e.g. `userRoutes.js`, `productRoutes.js`). Be aware `productRoutes.js` defines handlers but currently is not mounted in `server.js` and the file appears to stop after route definitions (no `module.exports = router`).
- Middleware: `backend/midleware/authMidleware.js` — exposes `protect` (typoed folder name: `midleware` not `middleware`) which verifies JWT and sets `req.user` without password.
- Models: `backend/models/user.js`, `backend/models/product.js` — inspect schema fields and validation (e.g. `email` match, `password` hashing in pre-save hook).
- Frontend entry: `frontend/src/main.jsx` and app under `frontend/src/components` and `frontend/src/pages`.
- Build/config: `frontend/vite.config.js` and `frontend/package.json` (vite scripts). Backend scripts are in `backend/package.json`.

## Project-specific conventions & gotchas

- Folder name typo: middleware is stored in `backend/midleware/` — always import from that path.
- Some model fields contain misspellings (examples in `backend/models/product.js`: `dimenisions`, `weigth`). Keep these exact names if reading/writing DB unless you intentionally migrate the schema.
- Route mounting: API endpoints are expected under `/api/...`. If adding a new route, mount it in `backend/server.js`.
- Auth: protected routes expect an Authorization header `Bearer <token>`. The `protect` middleware sets `req.user` to the DB user doc (without password).

## Small examples (copy/paste)

- Mount product routes (add this to `backend/server.js` near the `userRoutes` line):

```js
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
```

- Protect an endpoint in a route file (already used in `productRoutes.js`):

```js
const { protect } = require('../midleware/authMidleware');
router.post('/', protect, async (req, res) => { /* ... */ });
```

## Environment & security notes

- Required env vars: `MONGODB_URL`, `JWT_SECRET`. Keep `.env` out of source control.
- JWT tokens are signed with `process.env.JWT_SECRET` and expire in 1h in current implementation.

## Suggested quick checks for contributors

- If an API route doesn't respond, check `backend/server.js` to ensure it's mounted.
- If auth fails, confirm the frontend sends header `Authorization: Bearer <token>` and the backend `JWT_SECRET` matches the one used to sign tokens.
- When changing model field names, update any code that reads/writes the misspelled fields (or migrate the DB).

## Where to look next (useful files)

- `backend/server.js` — app bootstrap and route registration
- `backend/config/db.js` — mongoose connection
- `backend/midleware/authMidleware.js` — JWT auth logic
- `backend/routes/*.js` and `backend/models/*.js` — domain logic
- `frontend/package.json` and `frontend/vite.config.js` — how the frontend is served/built

If any of the above is unclear or you want me to (1) merge in additional README content, (2) add quick start scripts at the repo root, or (3) fix obvious issues (typos, missing exports), tell me which and I will update the repo accordingly.
