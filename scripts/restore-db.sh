#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Uso: $0 <arquivo.sql>"
  echo "Exemplo: $0 database/backups/vibeu_20260101_120000.sql"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_FILE="$1"
CONTAINER_NAME="${POSTGRES_CONTAINER:-vibeu-postgres}"

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "Erro: arquivo não encontrado: ${BACKUP_FILE}"
  exit 1
fi

# Carrega variáveis do .env se existir
if [[ -f "${PROJECT_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
  set +a
fi

POSTGRES_DB="${POSTGRES_DB:-vibeu}"
POSTGRES_USER="${POSTGRES_USER:-vibeu}"

echo ">> ATENÇÃO: isso irá sobrescrever o banco '${POSTGRES_DB}'."
read -r -p ">> Deseja continuar? (s/N): " CONFIRM
if [[ "${CONFIRM}" != "s" && "${CONFIRM}" != "S" ]]; then
  echo ">> Operação cancelada."
  exit 0
fi

echo ">> Restaurando backup: ${BACKUP_FILE}"
docker exec -i "${CONTAINER_NAME}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" < "${BACKUP_FILE}"

echo ">> Restore concluído com sucesso."
