# PlacementTrack
### Campus placement and job application tracker

PlacementTrack helps students keep company applications, interview dates, and outcomes in one place. It is a small full-stack project demonstrating CRUD operations, REST APIs, input validation, relational storage, and a dashboard.

**Problem:** During placements, applications and interview details can become scattered across notes and spreadsheets. This app provides a searchable record of each application and a summary of its current status.


## What it does

- Add, view, edit, and delete applications.
- Search company names and combine status and job-type filters.
- Store role, application date, optional interview date, location, package in LPA, and notes.
- Show total applications and counts for Online Assessment, Interview, Offer, and Rejected.
- Display a bar chart of applications by current status.

This version is a local prototype with a shared dataset and no login. It stores one current status per application; it does not retain a history of recruitment stages.

## Tech stack

| Technology | Role in this project |
| --- | --- |
| React + JavaScript | Pages, form state, loading states, and reusable components |
| React Router | Navigation between dashboard, list, add, and edit pages |
| Vite | Frontend development server and production build |
| Recharts + CSS | Status bar chart and interface styling |
| Python + FastAPI | HTTP endpoints and automatic API documentation |
| Pydantic | Request validation and response schemas |
| SQLAlchemy | Application table mapping, queries, and database sessions |
| PostgreSQL + psycopg | Persistent relational storage and database driver |

## How an application is saved

1. The student completes the React form; required fields are checked by the browser.
2. The form converts blank optional values to `null` and package input to a number.
3. `services/api.js` sends JSON using `fetch` to `POST /applications`.
4. FastAPI validates the request with Pydantic.
5. SQLAlchemy adds the record, commits the transaction, and refreshes it to read its generated ID.
6. The API returns the saved record with HTTP `201`; React navigates to the applications list.

Editing first loads the record by ID and then submits its fields with `PUT`. Deleting asks for browser confirmation and sends `DELETE`.

## Project map

| File or directory | Start here to understand |
| --- | --- |
| [ApplicationForm.jsx](frontend/src/components/ApplicationForm.jsx) | Shared add/edit form and input conversion |
| [api.js](frontend/src/services/api.js) | Frontend requests and error handling |
| [Applications.jsx](frontend/src/pages/Applications.jsx) | List, filters, and deletion |
| [Dashboard.jsx](frontend/src/pages/Dashboard.jsx) | Dashboard cards and chart |
| [main.py](backend/app/main.py) | App setup, CORS, router registration, table creation |
| [database.py](backend/app/database.py) | Environment configuration and request-scoped sessions |
| [models.py](backend/app/models.py) | SQLAlchemy Application table |
| [schemas.py](backend/app/schemas.py) | Validation and allowed status/job-type values |
| [applications.py](backend/app/routes/applications.py) | CRUD endpoints and filter queries |
| [analytics.py](backend/app/routes/analytics.py) | Status grouping, counts, and percentages |

## Data and analytics

The `applications` table stores an integer primary key, company name, role, job type, current status, application date, optional interview date/location/package/notes, and automatic creation/update timestamps.

**Job types:** Internship, Full-Time, Internship + PPO.
**Statuses:** Applied, Online Assessment, Interview, Offer, Rejected.

The backend groups rows by current status with SQL `GROUP BY`. Missing categories appear as zero. Percentages are rounded to one decimal place:

- Interview rate = currently Interview ÷ total applications × 100.
- Offer rate = currently Offer ÷ total applications × 100.
- Both are zero when the database is empty.

**Interpretation:** Moving a record from Interview to Offer reduces the Interview count. These are current-status shares, not historical conversion rates.

## API reference

| Method | Endpoint | Result |
| --- | --- | --- |
| GET | `/` | API running message |
| POST | `/applications` | Create; `201` and saved record |
| GET | `/applications` | List, newest application date first, then ID |
| GET | `/applications/{id}` | One record or `404` |
| PUT | `/applications/{id}` | Update; requires all mandatory application fields |
| DELETE | `/applications/{id}` | Delete; `204` with no response body |
| GET | `/analytics` | Counts, percentages, and status distribution |

List queries support `company` (case-insensitive substring), `status`, and `job_type`. Supplied filters are combined with AND.

Example: `/applications?company=demo&status=Interview&job_type=Full-Time`

Pydantic rejects invalid payloads with `422`, including unsupported statuses/job types and negative packages. Missing IDs return `404` for read, update, and delete.

## Run locally

Prerequisites: Python 3.10+, **Node.js 22.12+ (or 20.19+ in the Node 20 line)**, npm, and PostgreSQL. These Node minimums match the checked-in frontend lockfile.

### 1. Clone and create the database

```bash
git clone https://github.com/100Sharma44/placement-track.git
cd placement-track
```

In your PostgreSQL SQL console, using an account allowed to create databases:

```sql
CREATE DATABASE placement_track;
```

### 2. Start the backend

From the repository root, on macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
```

On Windows PowerShell, use `python -m venv .venv`, `.\.venv\Scripts\Activate.ps1`, and `Copy-Item .env.example .env`.

Edit `backend/.env` with your own local PostgreSQL credentials:

```dotenv
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/placement_track
```

Percent-encode reserved characters in the username/password if necessary. Keep real credentials out of Git.

Start from the `backend` directory:

```bash
uvicorn app.main:app --reload --port 8000
```

API: http://localhost:8000
Interactive API docs: http://localhost:8000/docs

Tables are created automatically when the app loads. PostgreSQL must already be running and the database must exist.

### 3. Start the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev -- --port 5173 --strictPort
```

On Windows, replace `cp` with `Copy-Item`. Open http://localhost:5173. The example sets `VITE_API_URL=http://localhost:8000`.

Use port 5173 because backend CORS currently permits only `http://localhost:5173` and `http://127.0.0.1:5173`. Restart Vite after editing frontend environment values.

To check the production build:

```bash
npm run build
```

### Troubleshooting

| Symptom | Check |
| --- | --- |
| Backend fails during startup | PostgreSQL is running, database exists, and DATABASE_URL credentials are correct |
| DATABASE_URL is not set | Copy backend/.env.example to backend/.env and run from backend/ |
| Frontend cannot reach API | Backend is on port 8000; VITE_API_URL is correct |
| CORS error | Open frontend on one of the allowed port-5173 origins |
| npm reports an unsupported engine | Use the Node version range above and install with npm ci |


## Scope and next improvements

Current limits: no authentication or per-user ownership, no status history, no pagination, no migration system, and no checked-in automated test suite. Duplicate applications are allowed. Validation does not enforce interview-date ordering or reject whitespace-only company names.

Useful next steps:
- Add login and associate every application with a user.
- Store stage changes separately to calculate historical conversion rates.
- Add pagination and automated API tests.
- Add database migrations and CSV export.

