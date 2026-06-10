CREATE TABLE events (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id      UUID NOT NULL REFERENCES users(id),
    name              VARCHAR(200) NOT NULL,
    description       TEXT NOT NULL,
    category          VARCHAR(30) NOT NULL,
    banner_url        VARCHAR(500) NOT NULL,
    event_date        DATE NOT NULL,
    start_time        TIME NOT NULL,
    end_time          TIME,
    location          VARCHAR(200) NOT NULL,
    address           VARCHAR(300) NOT NULL,
    cidade            VARCHAR(100) NOT NULL,
    estado            VARCHAR(2) NOT NULL,
    capacity          INT NOT NULL CHECK (capacity > 0),
    status            VARCHAR(15) NOT NULL DEFAULT 'RASCUNHO'
        CHECK (status IN ('RASCUNHO', 'PUBLICADO', 'CANCELADO', 'ENCERRADO')),
    featured          BOOLEAN NOT NULL DEFAULT FALSE,
    popularity_score  INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_lots (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    price       DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    quantity    INT NOT NULL CHECK (quantity > 0),
    sold        INT NOT NULL DEFAULT 0 CHECK (sold >= 0),
    starts_at   DATE,
    ends_at     DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_schedule_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    time        TIME NOT NULL,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE event_rules (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    rule_text   VARCHAR(500) NOT NULL,
    sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE event_faculdades (
    event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    faculdade_id  UUID NOT NULL REFERENCES faculdades(id),
    PRIMARY KEY (event_id, faculdade_id)
);

CREATE TABLE event_atleticas (
    event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    atletica_id  UUID NOT NULL REFERENCES atleticas(id),
    PRIMARY KEY (event_id, atletica_id)
);

CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_event_lots_event ON event_lots(event_id);
