# AlterEgo

An Etsy-style marketplace for punk fashion — patchwork, studs, and visible mending. Users sign up, open a shop, list handmade pieces, and buy from each other.

## Stack

- **client/** — React + Vite, `react-router-dom` for routing, plain CSS for the patchwork/punk theme.
- **server/** — Express API with cookie-session auth (bcrypt-hashed passwords) and a JSON file (`server/data/store.json`) as the datastore. No external database required.

## Running it

Two terminals:

```
cd server
npm install
npm run dev      # http://localhost:5000
```

```
cd client
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so just open http://localhost:5173.

## Demo accounts

Seeded on first server run (`server/data/store.json` is created automatically):

- `crow@alterego.test` / `password123` — Crowbait Studs & Scraps
- `marrow@alterego.test` / `password123` — Marrow Mender Mending Co.

## Notes

- Checkout is simulated — no real payment processor is wired up.
- Cart state lives in `localStorage`; accounts, listings, and orders live on the server.
- Delete `server/data/store.json` to reset all data back to the seed set.

## Deploying to Render

This repo includes a `render.yaml` Blueprint that runs the whole app as a single Render Web Service: Express serves the JSON API under `/api/*` and also serves the built React app for everything else, so there's no CORS to configure and nothing else to deploy separately.

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the Render dashboard: **New > Blueprint**, point it at the repo. Render reads `render.yaml` and creates the `alterego` web service automatically, including a randomly generated `SESSION_SECRET`.
3. Wait for the build (`cd client && npm install && npm run build && cd ../server && npm install`) and deploy to finish, then open the assigned `onrender.com` URL.

**Data persistence caveat:** the free plan has no persistent disk, so `server/data/store.json` — every account, listing, and order — resets back to the seed data on each deploy and whenever the free instance spins down from inactivity (~15 min idle). That's fine for a demo, but if you want data to actually stick around, either:
- switch the service to a paid instance type and attach a [Render Disk](https://render.com/docs/disks) mounted at `server/data`, or
- swap the JSON-file store in `server/data/db.js` for a real database (e.g. Render Postgres).
