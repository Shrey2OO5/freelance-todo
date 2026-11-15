CREATE TABLE tasks (
id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
task_title VARCHAR(250) NOT NULL CHECK (length(trim(task_title)) > 0),
is_complete boolean DEFAULT false NOT NULL
);