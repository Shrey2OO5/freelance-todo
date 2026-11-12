# Your Tasks

A todo application built with vanilla JavaScript, Express, and PostgreSQL. Create tasks, edit their titles, mark them complete, and delete them, with changes saved in a relational database.

This is a learning project focused on understanding browser/server communication, raw SQL, connection pooling, dependency injection, and error handling without an ORM.

## Project status

The PostgreSQL version is under development on `feature/postgres-backend`. Core CRUD flows have been manually tested through the UI. Automated backend integration tests and further refactoring are next.

The earlier browser-only version was deployed to GitHub Pages and used localStorage. These instructions describe the backend version. GitHub Pages alone cannot run its Express servers or PostgreSQL database.

## Features

- Create tasks with trimmed, nonblank titles up to 250 characters.
- Load saved tasks from PostgreSQL.
- Edit task titles and toggle completion.
- Delete individual tasks and show an empty state when no tasks remain.
- Display application errors and fallback messages for failed requests.
- Responsive layout with keyboard focus indicators.

There are no user accounts or authentication yet. All requests use the same task collection; this version is intended for local development.

## Stack and structure

- **Frontend:** HTML, CSS, vanilla JavaScript, and the Fetch API.
- **Backend:** Node.js with ES modules and Express 5.
- **Database:** PostgreSQL, accessed through `pg` using parameterized SQL.
- **Testing tools:** Vitest and jsdom; existing tests still target the previous implementation.

```text
client/
  index.js              Express static server on port 3000
  public/
    index.html          Page structure
    styles.css          Styling and responsive layout
    script.js           Browser entry point
    ui.js               Rendering and event handlers
    api.js              HTTP requests to the backend
server/
  server.js             API server on port 5000
  routes/task.routes.js HTTP handlers and responses
  services.js           Service layer
  repository.js         SQL and database operations
  injector.js           Connects the pool, repository, and service
  db.js                 Shared PostgreSQL connection pool
  cors.config.js        Allowed frontend origin
  services.test.js      Legacy tests awaiting replacement
shared/
  errorCodes.js         Backend application error constants
```

Requests flow from the browser's API module through Express routes, the service, and the repository to PostgreSQL. Database credentials stay on the backend. The repository receives its pool through its constructor so another pool can be supplied for tests.

## Run locally

### 1. Install dependencies

Use Node.js 24 (developed with v24.19.0), npm, and a running PostgreSQL installation with `psql` available.

```bash
git clone https://github.com/Shrey2OO5/freelance-todo.git
cd freelance-todo
git switch feature/postgres-backend
npm ci
```

### 2. Create the database

For a fresh local installation, connect as a PostgreSQL administrator:

```bash
psql -U postgres
```

Create an application role, set its password interactively, and create its database:

```sql
CREATE ROLE todo_app WITH LOGIN;
```

```text
\password todo_app
```

```sql
CREATE DATABASE todo_db OWNER todo_app;
```

Exit with `\q`, then connect as the application role:

```bash
psql -h localhost -U todo_app -d todo_db
```

Create the table:

```sql
CREATE TABLE tasks (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_title varchar(250) NOT NULL
    CHECK (length(trim(task_title)) > 0),
  is_complete boolean DEFAULT false NOT NULL
);
```

If the role, database, and table already exist, skip their creation. Schema setup is manual; the application does not create tables or run migrations on startup.

### 3. Configure the backend

Create `.env` in the project root:

```dotenv
PGHOST=localhost
PGPORT=5432
PGDATABASE=todo_db
PGUSER=todo_app
PGPASSWORD="replace_with_your_local_password"
```

Use your own password. Quoting preserves characters such as `#`. `.env` is excluded by `.gitignore`; do not commit credentials.

### 4. Start both servers

Run these commands from the project root in separate terminals.

Backend:

```bash
node --env-file=.env server/server.js
```

Frontend static server:

```bash
node client/index.js
```

Open [the app at localhost:3000](http://localhost:3000). The API runs at [localhost:5000](http://localhost:5000).

CORS currently permits exactly `http://localhost:3000`. The browser API URL is configured in `client/public/api.js`. If you change hosts or ports, update those settings together. Restart the relevant Node process after changing server code.

## API

Request bodies use JSON with `Content-Type: application/json`.

| Method | Path | Behavior | Successful status |
| --- | --- | --- | --- |
| GET | `/` | Server availability message | 200 |
| GET | `/tasks` | List tasks ordered by ID | 200 |
| POST | `/tasks` | Create an incomplete task | 201 |
| PATCH | `/tasks/:id` | Update the task title | 200 |
| PATCH | `/tasks/:id/completion` | Toggle completion | 200 |
| DELETE | `/tasks/:id` | Delete one task | 200 |

Creation and title updates accept:

```json
{ "task_title": "Read a chapter" }
```

Creation, editing, and completion responses contain a `message` and one `task`:

```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "task_title": "Read a chapter",
    "is_complete": false
  }
}
```

Listing returns `{ "message": "Got tasks", "tasks": [] }` when empty. Deletion returns a message and `tasksDeleted`, the number of affected rows. The completion endpoint takes no body and flips the current value on each successful call.

Handled input errors return 400, missing tasks return 404, and unexpected failures return 500. Error responses contain `message` and `errorCode`; the frontend displays recognized errors or a general fallback.

## Verification and next steps

Manual checks performed during development include creation, reading, title edits, completion changes, deletion, persistence after refresh, empty-state transitions, and deliberate error cases.

`npm test` currently points to legacy localStorage tests that do not match the new backend. It is not yet a passing verification suite for this version. The GitHub Actions workflow also still targets the earlier static deployment and needs updating before merging this branch into `main`.

Next steps:

- Add backend integration tests using an isolated test database.
- Refactor repeated validation and UI error handling.
- Update CI and deployment configuration for the backend architecture.
- Introduce authentication, task ownership, and cloud deployment incrementally.
