# Your Tasks

A responsive todo application built with vanilla JavaScript, HTML, and CSS. Create, edit, complete, and delete tasks, with browser-based persistence through localStorage.

[Try the live demo](https://Shrey2OO5.github.io/freelance-todo/) · [Explore the PostgreSQL backend upgrade](https://github.com/Shrey2OO5/freelance-todo/tree/feature/postgres-backend)

## Features

- Add tasks with trimmed titles and reject blank input.
- Edit task titles without losing completion status.
- Mark tasks complete and undo completion.
- Delete individual tasks.
- Keep tasks across page refreshes using localStorage.
- Display an empty state when no tasks remain.
- Adapt the layout to mobile and desktop screens, with visible keyboard focus indicators.

## Tech stack

| Area | Technology |
| --- | --- |
| Interface | HTML5, CSS3, vanilla JavaScript |
| Browser modules | Native ES modules |
| Persistence | localStorage |
| Tests | Vitest with jsdom |
| CI and hosting | GitHub Actions and GitHub Pages |

The version on `main` runs entirely in the browser. It does not require a backend, database server, or account.

## How it works

The code separates rendering, task rules, and persistence:

```text
script.js → ui.js → services.js → storageOperations.js → localStorage
```

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure and task form |
| `styles.css` | Layout, responsive styling, and interaction states |
| `script.js` | Initializes event handling and loads tasks |
| `ui.js` | Renders tasks and handles user interactions |
| `services.js` | Validates titles and coordinates task operations |
| `storageOperations.js` | Reads and writes task data in localStorage |
| `services.test.js` | Tests task behavior through the service layer |

Tasks contain an ID, a title, and a completion flag. User actions update storage, then refresh the rendered list. Task titles are rendered using `textContent`.

## Run locally

Clone the repository and select the browser-only version:

```bash
git clone https://github.com/Shrey2OO5/freelance-todo.git
cd freelance-todo
git switch main
```

Serve the project directory with a local HTTP server, such as VS Code's Live Server extension, and open `index.html` through that server. Use HTTP rather than opening the file directly because the app uses JavaScript modules.

The browser app needs no build step or npm dependencies to run. Node.js and npm are needed for the tests.

## Tests and deployment

Using Node.js 24 (CI is configured for v24.19.0), install dependencies and run:

```bash
npm ci
npm test
```

The eight service tests cover title trimming, rejecting blank titles, completion, deletion, title updates, and operations with nonexistent IDs. Each test starts with cleared localStorage in jsdom.

GitHub Actions is configured to run tests for pushes and pull requests targeting `main`. After successful tests on a push to `main`, it publishes the static application to GitHub Pages.

## Storage limitations

Tasks belong to the browser profile and site origin where they were created. They do not sync across devices or browsers, and clearing site data removes them. There are no user accounts or cloud backups in this version.

## Backend upgrade in progress

The [feature/postgres-backend branch](https://github.com/Shrey2OO5/freelance-todo/tree/feature/postgres-backend) evolves this project into an Express API backed by PostgreSQL.

That branch includes CRUD endpoints, raw parameterized SQL through `pg`, a shared connection pool, dependency injection, and frontend API integration. Core flows have been manually exercised; backend integration tests and further refactoring are planned before merging.

The live GitHub Pages demo remains the browser-only version. Backend setup instructions are available in the feature branch's README.

This project is being developed incrementally to practice JavaScript fundamentals, separation of responsibilities, testing, and the transition from browser storage to a backend API. Authentication and cloud backend deployment are future learning goals.
