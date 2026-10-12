# Web client

A minimal React + TypeScript single-page application, built with Vite. It
renders one placeholder landing view and contains no routing, styling system,
UI kit, form library, state library, or authentication code — those are
scoped to later tickets.

## Requirements

- Node.js >= 20
- npm

## Getting started

```bash
npm install
npm run dev
```

Vite prints a local URL (typically `http://localhost:5173`); open it in a
browser to see the placeholder landing view.

## Configuration

Copy `.env.example` to `.env` and adjust as needed:

| Variable              | Default                 | Description                                          |
| ---------------------- | ------------------------ | ------------------------------------------------------ |
| `VITE_API_BASE_URL`   | `http://localhost:3000` | Base URL the client uses to reach the backend API.    |

The resolved value is read at build/dev time via `import.meta.env` (see
`src/config/env.ts`) and rendered on the placeholder page.

## Scripts

| Script          | Purpose                                                  |
| ---------------- | ----------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server.                                |
| `npm run build`   | Type-check (`tsc -b`) and build for production into `dist/`. |
| `npm run preview` | Preview the production build locally.                    |
| `npm test`        | Run the automated test suite (Vitest).                    |
| `npm run lint`    | Run ESLint over `src`.                                    |
