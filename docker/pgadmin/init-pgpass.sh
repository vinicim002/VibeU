#!/bin/sh
set -eu

PGPASS_FILE="/var/lib/pgadmin/pgpass"
POSTGRES_USER="${POSTGRES_USER:-vibeu}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-dev_password_change_me}"

printf 'postgres:5432:*:%s:%s\n' "$POSTGRES_USER" "$POSTGRES_PASSWORD" > "$PGPASS_FILE"
chmod 600 "$PGPASS_FILE"

exec /entrypoint.sh "$@"
