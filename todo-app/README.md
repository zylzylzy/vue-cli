# Full-Stack Todo App (Node + SQLite + Vue 3 + TypeScript)

This project includes:
- **Backend**: Node.js HTTP server
- **Database**: SQLite (using Node's built-in `node:sqlite` module)
- **Frontend**: Simple HTML page using Vue 3, with frontend logic written in TypeScript
- **API Endpoints**:
  - `POST /api/tasks` (create task)
  - `GET /api/tasks` (list tasks)
  - `DELETE /api/tasks/:id` (delete task)

## 1) Create and activate a virtual environment

> This uses a Python virtual environment to isolate tooling, then installs a local Node runtime inside it using `nodeenv`.

```bash
cd todo-app
python3 -m venv .venv
source .venv/bin/activate
pip install nodeenv
nodeenv -p --node=22
```

## 2) Build the frontend TypeScript

```bash
npm run build:client
```

## 3) Run the project

```bash
npm start
```

Open: http://localhost:3000

## Project structure

```text
todo-app/
├── public/
│   └── index.html
├── src/frontend/
│   └── app.ts
├── server.js
├── package.json
└── tsconfig.json
```

## Notes

- SQLite data is stored in `todo.db` in the project root.
- Frontend TypeScript (`src/frontend/app.ts`) is compiled to `public/app.js`.
