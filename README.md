# PlacementTrack — Campus Placement & Job Application Tracker

PlacementTrack is a simple full-stack application for college students to track the companies and roles they apply to during campus placements. It keeps applications, interview progress, offers, and basic placement analytics in one place.

## Features

- Add, view, edit, and delete placement applications
- Search by company name and filter by status or job type
- Track application dates, interview dates, location, package, and notes
- Dashboard counts for applications, assessments, interviews, offers, and rejections
- Bar chart grouped by application status
- Simple REST API with validation and PostgreSQL storage

## Tech Stack

- Frontend: React, Vite, React Router, Recharts, plain CSS
- Backend: Python, FastAPI, SQLAlchemy, Pydantic
- Database: PostgreSQL

## Architecture

```text
User
 ↓
React Frontend
 ↓
REST API / HTTP
 ↓
FastAPI Backend
 ↓
PostgreSQL Database
```

The frontend makes HTTP requests to FastAPI. FastAPI validates the data with Pydantic, uses SQLAlchemy to read/write PostgreSQL, and returns JSON to the frontend.

## Project Structure

```text
placement-track/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI setup and CORS
│   │   ├── database.py      # PostgreSQL connection and session
│   │   ├── models.py        # SQLAlchemy Application table
│   │   ├── schemas.py       # Request/response validation models
│   │   └── routes/          # Application and analytics endpoints
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/api.js  # API calls in one small file
│   ├── package.json
│   └── .env.example
└── README.md
```

## Database Model

`Application` stores: `id`, `company_name`, `role`, `job_type`, `application_status`, `application_date`, optional `interview_date`, `location`, `package_lpa`, and `notes`, plus automatic `created_at` and `updated_at` timestamps.

The initial job types are Internship, Full-Time, and Internship + PPO. The initial statuses are Applied, Online Assessment, Interview, Offer, and Rejected. They are simple lists in `backend/app/schemas.py` and `frontend/src/components/ApplicationForm.jsx`, so they can be adjusted later.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/applications` | Create an application |
| GET | `/applications` | List applications; supports `status`, `company`, and `job_type` queries |
| GET | `/applications/{id}` | Get one application |
| PUT | `/applications/{id}` | Update an application |
| DELETE | `/applications/{id}` | Delete an application |
| GET | `/analytics` | Get dashboard counts and rates |

## Run Locally

Prerequisites: Python 3.10+, Node.js 18+, npm, and a running PostgreSQL server.

### 1. Create the PostgreSQL database

Ensure PostgreSQL is running, then create an empty database:

```sql
CREATE DATABASE placement_track;
```

### 2. Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your PostgreSQL username/password. Then start the API:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive API documentation is at `http://localhost:8000/docs`. Tables are created automatically on backend startup for this version.

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the address Vite prints (usually `http://localhost:5173`). The default frontend URL already points to the local backend. Change `VITE_API_URL` in `frontend/.env` only if your backend uses another address.

## Screenshots

Add dashboard and applications-table screenshots here after running the project.

## Future Improvements

- User login so each student sees only their data
- Pagination for very large application lists
- Export applications to CSV
- Calendar view for interviews
- Automated tests and database migrations

## Interview Explanation

### What problem does this solve?

It gives a student one dashboard for tracking every campus-placement application instead of using scattered notes or spreadsheets.

### How do frontend and backend communicate?

React calls the FastAPI endpoints using `fetch`. The request and response bodies are JSON. For example, the add form sends a `POST /applications` request.

### What are REST APIs?

REST APIs expose URLs for working with data using standard HTTP methods. In this project, `GET` reads, `POST` creates, `PUT` updates, and `DELETE` removes applications.

### What does CRUD mean here?

CRUD means Create, Read, Update, Delete. Those are the four core operations available for an application record.

### Why FastAPI?

FastAPI is compact, readable, and provides automatic API documentation. Pydantic models also make it straightforward to validate incoming data.

### Why React?

React makes it easy to split the interface into clear pages and reusable components, while updating the screen when API data changes.

### Why PostgreSQL?

PostgreSQL is a reliable relational database. The data is structured as application records, making a relational table a natural fit.

### What happens when a user adds an application?

The form checks required browser fields, then React sends JSON to `POST /applications`. FastAPI validates it, SQLAlchemy saves a row in PostgreSQL, and the frontend redirects to the applications table.

### What happens when a user edits an application?

React first loads the existing record using its ID. After the user saves changes, it sends a `PUT /applications/{id}` request. The backend finds that row, updates its fields, and returns the updated JSON.

### How does filtering work?

The frontend sends selected filters as query parameters, such as `/applications?status=Interview`. The backend adds matching SQL conditions only for filters that were provided.

### How are analytics calculated?

The backend groups database rows by status and counts each group. Interview rate is `interviews / total applications × 100`; offer rate is `offers / total applications × 100`. Both return `0` when no records exist.
