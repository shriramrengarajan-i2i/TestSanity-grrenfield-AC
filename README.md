# Backend API

A minimal NestJS application: configuration via environment variables and an
unauthenticated health endpoint. A local PostgreSQL datastore is provisioned via
Docker Compose, but no ORM, migrations, or application database-access code are
included yet — see later scaffolding work for those.

## Requirements

- Node.js >= 20
- npm
- Docker and the `docker compose` CLI (for the local PostgreSQL datastore)

## Getting started

```bash
npm install
npm run start:dev
```

The server listens on the port read from the `PORT` environment variable
(default `3000`). On startup it logs the bound port and environment name.

## Verify it's running

With the server running locally:

```bash
curl http://localhost:3000/health
```

Expect an HTTP 200 response with a body like:

```json
{ "status": "ok", "uptime": 12.345, "timestamp": "2026-01-01T00:00:00.000Z" }
```

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

| Variable                      | Default                                                        | Description                                                                 |
| ------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `PORT`                        | `3000`                                                         | HTTP port the server listens on.                                            |
| `NODE_ENV`                    | `development`                                                  | Runtime environment name.                                                   |
| `LOG_LEVEL`                   | `log`                                                          | Minimum log level emitted by the Nest Logger.                               |
| `POSTGRES_PORT`               | `5432`                                                         | Host port the Postgres container publishes.                                |
| `POSTGRES_USER`               | `postgres`                                                     | Bootstrap superuser used only to run initdb; the app never connects as it.  |
| `POSTGRES_SUPERUSER_PASSWORD` | `postgres`                                                     | Password for the bootstrap superuser.                                      |
| `APP_DB_NAME`                 | `backend_api`                                                  | Dedicated application database, created on first container boot.           |
| `APP_DB_USER`                 | `backend_api`                                                  | Dedicated, non-superuser application role.                                  |
| `APP_DB_PASSWORD`             | `backend_api`                                                  | Password for the application role.                                         |
| `DATABASE_URL`                | `postgresql://backend_api:backend_api@localhost:5432/backend_api` | Connection string used by tooling (e.g. `db:check`) and later app code. |
| `KEYCLOAK_PORT`               | `8080`                                                          | Host port the Keycloak container publishes.                                |
| `KEYCLOAK_ADMIN_USER`         | `admin`                                                         | Bootstrap admin account for the Keycloak admin console. Local dev only.    |
| `KEYCLOAK_ADMIN_PASSWORD`     | `admin`                                                         | Password for the bootstrap admin account. Local dev only.                  |
| `KEYCLOAK_REALM`              | `desknest`                                                      | Realm imported from `keycloak/realm-export.json`.                          |
| `KEYCLOAK_CLIENT_ID`          | `desknest-client`                                               | OIDC client registered against the realm.                                  |
| `KEYCLOAK_BASE_URL`           | `http://localhost:8080`                                         | Base URL the application and tooling use to reach Keycloak.                |

## Local PostgreSQL datastore

A PostgreSQL 16 instance is provisioned via `docker-compose.yml` for local
development. It is reachable only through a dedicated application role and
database, distinct from the bootstrap superuser used solely to run `initdb`.

```bash
cp .env.example .env
npm run db:up      # starts postgres:16-alpine in the background
npm run db:check   # connects as the app role and runs SELECT 1
```

`npm run db:check` runs `scripts/db/check-connection.sh`, which reads
`DATABASE_URL` from the environment (loading `.env` if present) and exits
non-zero if the connection or query fails.

Stop the container with `npm run db:down` (data persists in the
`postgres_data` volume across restarts).

The application role and database are created once, at first container boot,
by `scripts/db/init-app-db.sh` (mounted into
`/docker-entrypoint-initdb.d/`). PostgreSQL only runs `initdb.d` scripts when
the data volume is empty — if you change `APP_DB_USER`/`APP_DB_PASSWORD`/`APP_DB_NAME`
after the first boot, the new values will not take effect until you reset the
volume:

```bash
npm run db:down
docker compose down -v   # also removes the postgres_data volume
npm run db:up
```

No ORM, migrations, or table definitions are introduced by this datastore
setup — see later scaffolding work for schema and data-access code.

## Local Keycloak identity provider

A Keycloak instance is provisioned via `docker-compose.yml` for local
development, pre-configured through a declarative realm import
(`keycloak/realm-export.json`):

- Realm: `desknest`.
- OIDC client: `desknest-client` — a single **public** client (no secret is
  committed) used for both the web client's browser redirect flow
  (`standardFlowEnabled`, with PKCE required) and token-only verification
  via the direct-grant flow (`directAccessGrantsEnabled`), which the smoke
  test and manual checks rely on to obtain tokens without a browser. A later
  ticket may split this into separate public/confidential clients if the
  backend ends up needing its own confidential client (e.g. for token
  introspection) — left open, not decided here.
- Realm roles: `employee` and `office-admin`.
  **Decision: these are realm roles, not client roles.** The architecture
  models a single session-level role per user, and only one OIDC client
  exists in this design, so a realm role is visible in
  `realm_access.roles` on every token regardless of which client issued it —
  simpler for the backend/Passport adapter (a later ticket) to read.
- No realm users, client secrets, or SMTP/other integrations are configured.
  This ticket seeds no product accounts (`admin`, `employee`, `employee2`)
  and wires no application code (no Passport adapter, no Login screen, no
  session creation, no server-side authorization) — see the
  account-login and admin-only-access tickets for that work.

```bash
cp .env.example .env
npm run idp:up      # starts Keycloak in the background
npm run idp:check   # runs scripts/keycloak/smoke-test.sh
```

`npm run idp:check` runs `scripts/keycloak/smoke-test.sh`, which waits for
the realm's OIDC discovery endpoint to respond, creates a throwaway
`smoke-test-user` via the Admin REST API, obtains a token for it via the
direct-grant flow against `desknest-client`, asserts the `employee` realm
role appears in the token, then deletes the test user (even on failure).

Stop the container with `npm run idp:down` (shared with `db:down`, since
Keycloak and Postgres run in the same Compose project). Data persists in the
`keycloak_data` volume across restarts, so `--import-realm` only imports the
realm once; if you change `keycloak/realm-export.json`, reset the volume to
re-import it, exactly like the Postgres volume caveat above:

```bash
npm run idp:down
docker compose down -v   # also removes the keycloak_data volume
npm run idp:up
```

To confirm manually: open `http://localhost:${KEYCLOAK_PORT}/admin/` and
sign in with `KEYCLOAK_ADMIN_USER`/`KEYCLOAK_ADMIN_PASSWORD`, then confirm
the `desknest` realm, the `desknest-client` client, and the
`employee`/`office-admin` realm roles are present. A full interactive
browser login (authorization-code/redirect flow) against the client has no
scripted equivalent and remains an optional manual check.

## Scripts

| Script             | Purpose                                                      |
| ------------------ | -------------------------------------------------------------- |
| `npm run start`     | Start the application.                                       |
| `npm run start:dev` | Start with file-watch auto-restart.                          |
| `npm run build`     | Compile TypeScript to `dist/`.                                |
| `npm test`          | Run unit tests.                                               |
| `npm run test:e2e`  | Run end-to-end tests (includes `/health`).                     |
| `npm run db:up`     | Start the local PostgreSQL container.                         |
| `npm run db:down`   | Stop the local PostgreSQL container.                           |
| `npm run db:check`  | Connect to PostgreSQL as the app role and run `SELECT 1`.     |
| `npm run idp:up`    | Start the local Keycloak container.                            |
| `npm run idp:down`  | Stop the local Keycloak container (and Postgres, same project). |
| `npm run idp:check` | Run the Keycloak discovery/token/role-claim smoke test.        |
