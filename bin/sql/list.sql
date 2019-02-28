CREATE TABLE list (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    CONSTRAINT same_title UNIQUE(title)
);