# Backend API

A minimal NestJS application: configuration via environment variables and an
unauthenticated health endpoint. No database, auth, or business-domain code is
included yet — see later scaffolding work for those.

## Requirements

- Node.js >= 20
- npm

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

| Variable    | Default       | Description                                   |
| ----------- | ------------- | ---------------------------------------------- |
| `PORT`      | `3000`        | HTTP port the server listens on.               |
| `NODE_ENV`  | `development` | Runtime environment name.                      |
| `LOG_LEVEL` | `log`         | Minimum log level emitted by the Nest Logger.  |

## Scripts

| Script             | Purpose                                   |
| ------------------ | ------------------------------------------ |
| `npm run start`     | Start the application.                     |
| `npm run start:dev` | Start with file-watch auto-restart.        |
| `npm run build`     | Compile TypeScript to `dist/`.             |
| `npm test`          | Run unit tests.                            |
| `npm run test:e2e`  | Run end-to-end tests (includes `/health`). |
