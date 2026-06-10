ALTER TABLE faculdades ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE atleticas ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN popular BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_faculdades_featured ON faculdades(featured) WHERE featured = TRUE;
CREATE INDEX idx_atleticas_featured ON atleticas(featured) WHERE featured = TRUE;
CREATE INDEX idx_events_featured ON events(featured) WHERE featured = TRUE;
CREATE INDEX idx_events_popular ON events(popular) WHERE popular = TRUE;
