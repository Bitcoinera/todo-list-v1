CREATE TABLE item (
    id      SERIAL PRIMARY KEY,
    todo    VARCHAR(10000),
    CONSTRAINT same_todo UNIQUE(todo)
);