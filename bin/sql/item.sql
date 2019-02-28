CREATE TABLE item (
    id      SERIAL PRIMARY KEY,
    todo    TEXT,
    list VARCHAR(64),
    CONSTRAINT same_todo UNIQUE(todo)
);