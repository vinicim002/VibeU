CREATE TABLE faculdades (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome        VARCHAR(200) NOT NULL,
    sigla       VARCHAR(20) NOT NULL,
    cidade      VARCHAR(100) NOT NULL,
    estado      VARCHAR(2) NOT NULL,
    logo        VARCHAR(500),
    status      VARCHAR(10) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE atleticas (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome            VARCHAR(200) NOT NULL,
    sigla           VARCHAR(50) NOT NULL,
    descricao       TEXT,
    logo            VARCHAR(500),
    faculdade_id    UUID NOT NULL REFERENCES faculdades(id),
    status          VARCHAR(10) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_atleticas_faculdade ON atleticas(faculdade_id);
