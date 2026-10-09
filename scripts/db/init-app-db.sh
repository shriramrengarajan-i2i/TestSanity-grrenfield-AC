#!/usr/bin/env bash
# Runs once on first container boot (data volume empty) as the bootstrap
# superuser, via /docker-entrypoint-initdb.d/. Creates a dedicated,
# non-superuser application role and database, distinct from the bootstrap
# superuser used only to run initdb.
set -euo pipefail

: "${APP_DB_NAME:?APP_DB_NAME must be set}"
: "${APP_DB_USER:?APP_DB_USER must be set}"
: "${APP_DB_PASSWORD:?APP_DB_PASSWORD must be set}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-SQL
    CREATE ROLE "${APP_DB_USER}" LOGIN PASSWORD '${APP_DB_PASSWORD}' NOSUPERUSER NOCREATEDB NOCREATEROLE;
    CREATE DATABASE "${APP_DB_NAME}" OWNER "${APP_DB_USER}";
    REVOKE ALL ON DATABASE "${APP_DB_NAME}" FROM PUBLIC;
    GRANT ALL PRIVILEGES ON DATABASE "${APP_DB_NAME}" TO "${APP_DB_USER}";
SQL
