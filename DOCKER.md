# Running SkyWings Airlines with Docker

Runs the whole stack — Express API, static frontend and MySQL 8 — in containers.
Nothing needs to be installed on the host except Docker.

## 1. Create your environment file

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace every `CHANGE_ME` value. Nothing is hardcoded in the
source; the containers read all credentials from this file, which is git-ignored.

To generate a strong `JWT_SECRET`:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 2. Start everything

```bash
docker compose up -d --build
```

Open <http://localhost:3000>.

First start takes a minute: MySQL initialises the data directory, applies
`database/schema/schema.sql`, and the seeder sets the default password hashes.

### Default accounts

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | admin@skywings.com    | `admin123` |
| User  | user@skywings.com     | `user123`  |

> Demo credentials — change them before exposing this anywhere.

### Optional demo dataset

Set `SEED_SAMPLE_DATA=true` in `.env` **before the first start** to also load
100 extra users, 100 flights, 150 bookings, passengers, seats and check-ins
(logins follow the `user1@skywings.com` / `user1123` pattern).

Already started without it? Re-run just the seeder:

```bash
docker compose down
docker volume rm skywings-airlines_seed_state
SEED_SAMPLE_DATA=true docker compose up -d
```

## What the stack contains

| Service   | Image                | Purpose |
|-----------|----------------------|---------|
| `mysql`   | `mysql:8.0`          | Database. Applies the schema on first boot via `/docker-entrypoint-initdb.d`. |
| `db-seed` | built from `database/` | One-shot: bcrypt password hashes + optional sample data, then exits. |
| `app`     | built from `backend/Dockerfile` | Express API on port 3000, also serves `frontend/`. |

Startup order is enforced with health checks: `app` waits for `mysql` to be
healthy **and** for `db-seed` to have completed successfully.

### Volumes (persistent data)

| Volume       | Mount            | Contents |
|--------------|------------------|----------|
| `mysql_data` | `/var/lib/mysql` | All database data. Survives `docker compose down`. |
| `seed_state` | `/state`         | Marker file so the seeder runs only once. |

`docker compose down` keeps your data. **`docker compose down -v` deletes both
volumes** — the database is rebuilt from scratch on the next start.

### Ports

| Host port | Container | Notes |
|-----------|-----------|-------|
| `3000`    | `app:3000`   | `APP_HOST_PORT`. Keep it at 3000: `frontend/js/main.js` calls `http://localhost:3000/api` when served from localhost. |
| `3307`    | `mysql:3306` | `MYSQL_HOST_PORT`. For Workbench / `mysql` CLI. Deliberately not 3306 so it never clashes with a MySQL installed on the host. Remove the mapping to keep the DB private to the Docker network. |

## Everyday commands

```bash
docker compose ps                 # status of all services
docker compose logs -f app        # follow application logs
docker compose logs db-seed       # what the seeder did
docker compose restart app        # restart the API only
docker compose up -d --build      # rebuild after changing code
docker compose down               # stop, keep data
docker compose down -v            # stop and wipe the database
```

Open a MySQL shell:

```bash
docker compose exec mysql mysql -u root -p skywings_airlines
```

## Troubleshooting

**`port is already allocated`** — something else uses 3000 or 3307. Change
`APP_HOST_PORT` / `MYSQL_HOST_PORT` in `.env`. If you move the app off 3000 you
must also update the API base URL in `frontend/js/main.js`.

**App exits with "Failed to connect to database"** — check `docker compose logs
mysql`. If the schema failed to apply, the data volume is in a half-built state;
`docker compose down -v` and start again.

**Login says "Invalid email or password" on a fresh stack** — the seeder didn't
run. Check `docker compose logs db-seed`.

**Code changes don't show up** — images are built, not mounted. Re-run
`docker compose up -d --build`.

## Notes for teammates running without Docker

Nothing here changes the native setup: keep using your local MySQL and your own
`database/.env` / `backend/.env`. The Docker work did fix three things that were
broken on MySQL 8.0 regardless of containers:

- `row_number` and `rows` are reserved words since MySQL 8.0.2; they are now
  back-quoted in `schema/schema.sql` (valid on 5.7 too). Previously the schema
  import aborted at the `seats` table, so no users, flights or seats were created.
- `LIMIT ?` is not allowed as a prepared-statement placeholder — fixed in
  `seeds/populate_seats_preferences_checkins.js` and `backend/routes/admin.js`
  (`/api/admin/hot-flights`).
- Hardcoded fallback DB passwords and the fallback `JWT_SECRET` were removed from
  the source. Set them in your `.env` as before.
