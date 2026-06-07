-- Migration inicial do VibeU.
-- Tabela de metadados para validar conexão e versionamento do schema.

CREATE TABLE app_metadata (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_metadata (key, value)
VALUES ('schema_version', '1.0.0');
