# SkyWings Airlines — working notes for Claude

Flight booking app: Express + MySQL API, vanilla-JS frontend served by the same
Express process. No build step, no test framework, no linter.

## Ground rule: two supported environments, both must keep working

Some of the team runs **Docker**; others run **Node + MySQL natively** on their
own machine (usually Windows, MySQL Server as a Windows service — *not* XAMPP).

**Never make a change that only works in the containerized setup.** Before
finishing any change, ask whether it still holds when:

- the app process is **not** in UTC (native devs run in their local zone, e.g. UTC+5)
- MySQL is on `localhost:3306` with the developer's own credentials, not the `mysql` service host
- `PORT` differs from 3000
- no `.env` value from `docker-compose.yml` exists

Concretely, that means: no hardcoded `localhost:3000`, no `mysql` hostname, no
new required env var without a sensible default, and nothing that assumes a UTC
clock. Frontend API calls derive their base from `window.location.origin`
(`main.js`, top of file) — keep it that way. The one deliberate exception is the
`.vercel.app` branch, where the frontend is deployed separately from the Render
backend; don't collapse it.

### Timezones — the sharp edge here

`backend/config/database.js` sets `dateStrings: false`, so **mysql2 converts
`DATETIME` ⇄ JS `Date` using the Node process's local timezone**. Reading is
symmetric in both setups, so it just works. Writing is where it breaks:

- **Do** bind a JS `Date` and let the driver format it — see `toDbDateTime()` in
  `backend/routes/admin.js`. The driver then writes in the same frame it reads,
  so the stored wall clock matches whatever convention that database already
  uses (UTC in Docker, local time natively).
- **Don't** pre-format a `"YYYY-MM-DD HH:mm:ss"` string on the client and store
  it verbatim. That bakes in the client's idea of the clock and shifts flights by
  the timezone offset on non-UTC setups. This was a real bug; see
  `toApiDateTime()` in `frontend/js/main.js`, which sends an ISO instant instead.
- **Do** decide "has this departed / is this in the past" with SQL `NOW()` rather
  than JS `new Date()` when the value is compared against a column, so the answer
  doesn't depend on the app server and MySQL agreeing on a zone.
- Comparing two absolute instants in JS (e.g. `new Date(booking.arrival_datetime)
  < new Date()`) is fine — both sides are instants.

To check a change under a non-UTC clock without a native install:

```bash
docker run --rm --network skywings-airlines_skywings -e TZ=Asia/Karachi \
  -e DB_PASSWORD=... -v "$(cygpath -w /tmp/check.js)":/app/backend/check.js:ro \
  skywings-app:latest node check.js
```

### SQL portability

Target **MySQL 5.7+** — native installs are not guaranteed to be 8.0. No CTEs, no
window functions, no `JSON_TABLE`. `row_number` is a reserved word in 8.0 and
must stay back-quoted (the `seats` table uses it).

## Layout

```
backend/          Express API — server.js, routes/, middleware/auth.js, config/database.js
frontend/         Static pages + js/main.js (~5k lines, all client logic) + css/style.css
database/schema/  schema.sql (also the Docker init script)
database/seeds/   Node seeders; add_more_flights.js et al. are random, not reproducible
```

`README.md` still documents an older flat layout (`sql/`, `scripts/`, root
`package.json`). Trust the tree above; `package.json` lives in `backend/`.

## Running it

- **Docker:** `docker compose up -d --build` → <http://localhost:3000>.
  Rebuild after editing backend or frontend files — the image copies them in, so
  `docker compose up -d` alone silently keeps serving the old code.
- **Native:** `cd backend && npm install && npm start`, with `.env` pointing at
  the local MySQL.
- Accounts: `admin@skywings.com` / `admin123`, `user@skywings.com` / `user123`.
  Seeded users are `userN@skywings.com` / `userN123`.

## Conventions worth matching

- Every endpoint returns `{ success, message?, data? }`; the frontend's
  `apiRequest()` throws on `success: false`.
- Auth is a Bearer JWT in `localStorage`; `authenticate` / `requireAdmin` in
  `backend/middleware/auth.js`.
- Frontend is inline `onclick=`/`onsubmit=` handlers calling globals in
  `main.js`. Match that style rather than introducing modules or a framework.
- `bookings.status` ENUM is `pending|confirmed|cancelled|completed`. **`missed`
  is display-only** — derived in `getDisplayBookingStatus()` from arrival time
  plus check-in state. Writing it to the column fails with a truncation error.
- `bookings.flight_id` is `ON DELETE RESTRICT`, so *any* booking row — cancelled
  and completed included — blocks deleting a flight. Take flights out of service
  by setting status to `cancelled`.

## Testing

There is no test runner. Verify with the app actually running: drive the API with
`curl` (auth → search → book → check-in → cancel, plus the admin and reports
endpoints), and for frontend logic pull the function out of `main.js` and
exercise it in Node. **Clean up any rows you create** — teammates share this
database — and confirm counts afterwards.

## Beware

- `frontend/js/main.js` has repeated near-identical blocks (the "already checked
  in" handling appears ~11 times). Fix the shared helper, not one copy.
- Seed data is random per install; row IDs and flight numbers differ per machine.
  Don't hardcode them in checks.
