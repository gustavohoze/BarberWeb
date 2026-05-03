# BarberWeb

BarberWeb is a web application for managing a barber shop, including scheduling, client management, and operational workflows.

## Tech stack

The repository uses multiple technologies:

- **TypeScript** (primary)
- **HTML/CSS**
- **Go** (backend services)
- **PostgreSQL / PLpgSQL** (database functions and scripts)
- **Shell** (automation / tooling)

## Getting started

> These steps are a general starting point. If the repo contains additional setup scripts or environment variables, follow those as well.

### Prerequisites

- Node.js (LTS recommended)
- pnpm / npm / yarn (depending on what the project uses)
- Go (if you run the Go services locally)
- PostgreSQL (for the database)

### Install dependencies

```bash
# pick the package manager used by the project
npm install
```

### Run the app (development)

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Database

If you are running the database locally:

1. Create a PostgreSQL database.
2. Apply migrations / SQL scripts from this repo (if present).
3. Configure the application with the connection string via environment variables.

## Project structure

- `frontend/` (if present) — UI
- `backend/` or `api/` (if present) — services / API
- `db/` (if present) — SQL, functions, migrations

## Contributing

1. Create a feature branch
2. Commit your changes with a clear message
3. Open a pull request

## License

Add a license if you plan to distribute this project.
