#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${PROJECT_ROOT}/database/backups"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
CONTAINER_NAME="${POSTGRES_CONTAINER:-vibeu-postgres}"

# Carrega variáveis do .env se existir
if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
  set +a
fi

POSTGRES_DB="${POSTGRES_DB:-vibeu}"
POSTGRES_USER="${POSTGRES_USER:-vibeu}"
BACKUP_FILE="${BACKUP_DIR}/vibeu_${TIMESTAMP}.sql"

mkdir -p "${BACKUP_DIR}"

echo ">> Gerando backup: ${BACKUP_FILE}"
docker exec "${CONTAINER_NAME}" pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "${BACKUP_FILE}"

echo ">> Backup concluído com sucesso."
