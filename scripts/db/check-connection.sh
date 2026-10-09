#!/usr/bin/env bash
# Connectivity check: connects as the application role and runs SELECT 1.
# Reads connection parameters only from the environment (DATABASE_URL, loaded
# from .env when present); no credentials are hard-coded.
set -euo pipefail

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${DATABASE_URL:?DATABASE_URL must be set (see .env.example)}"

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "SELECT 1;"
