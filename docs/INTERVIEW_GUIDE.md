# PlacementTrack: fresher interview guide

## 30-second explanation

“PlacementTrack is a full-stack application for students to organize job applications during placements. It stores company and role details, dates, notes, and the current application status. The frontend uses React, the backend exposes FastAPI endpoints, and PostgreSQL stores the records through SQLAlchemy. Students can add, edit, delete, search, and filter applications, then see status counts on a dashboard.”

Use this as a project description. Describe your personal contribution accurately, including any AI assistance; be ready to explain and modify the code you present.

## Problem, workflow, and stack in plain language

**Problem:** A student applying to several companies needs one place to check which role they applied for, the current stage, and interview details.

**Workflow:** Fill a form → send a JSON request → validate it → save a database row → return JSON → display the saved application. The dashboard asks the backend to count rows grouped by status.

**Stack:** React handles the screen; React Router handles navigation; Vite runs/builds the frontend; Recharts draws the chart. FastAPI handles requests, Pydantic checks their data, SQLAlchemy works with tables, and psycopg connects to PostgreSQL.

## Likely questions and short answers

| Question | Answer grounded in this project |
| --- | --- |
| What is CRUD? | Create, Read, Update, Delete: adding, viewing, editing, and removing application records. |
| How do frontend and backend communicate? | The fetch wrapper in api.js sends HTTP requests. Create/update bodies and responses use JSON. |
| Why React? | It gives reusable components and state-driven updates. The same ApplicationForm serves both add and edit pages. |
| Why FastAPI? | It keeps the API readable, uses Pydantic schemas, and generates interactive documentation at /docs. |
| Why PostgreSQL? | Applications have structured fields and fit a relational table. Records survive backend restarts. |
| What is an ORM? | SQLAlchemy maps the Python Application class to the applications table, allowing queries through Python expressions. |
| How are schemas different from models? | models.py describes stored columns; schemas.py describes validated API input/output. |
| What happens after clicking Save? | The form converts inputs, POSTs JSON, FastAPI validates it, and SQLAlchemy adds, commits, and refreshes a row. React then navigates to the list. |
| Why commit and refresh? | Commit saves the transaction; refresh reloads database-generated values such as the ID and timestamps. |
| What do useState and useEffect do here? | useState holds form values, records, loading, and errors. useEffect fetches initial data when a page mounts; editing also reloads when the ID changes. |
| How does search work? | Query parameters reach the backend; company uses case-insensitive ILIKE with surrounding wildcards. Status and job type use equality. Filters combine with AND. |
| What happens for a missing ID? | GET, PUT, and DELETE raise HTTP 404 with “Application not found”. |
| What validation exists? | Pydantic checks required fields, string limits, dates, allowed statuses/job types, and nonnegative package values. Invalid request data returns 422. |
| Why validate on the server too? | A caller can bypass the browser form and send requests directly, so the API must check its own input. |
| What is CORS? | It controls which browser origins can access the API. This app allows the two local frontend origins on port 5173; CORS is not authentication. |
| Does PUT support a partial update? | No. Its schema requires the same mandatory fields as creation. The edit form sends the application fields; there is no PATCH endpoint. |
| Why handle 204 separately? | A successful DELETE returns no body, so the fetch wrapper returns null instead of parsing JSON. |
| How are analytics calculated? | SQL GROUP BY counts current statuses. Interview and offer counts are divided by total records, rounded to one decimal, with zero for an empty database. |
| Is the interview rate a conversion rate? | No. It is the share currently marked Interview. Moving a record to Offer removes it from that count. Historical rates would require stage history. |
| Can multiple students use private accounts? | This version has no login or user ownership. All callers use the same dataset. |
| What would you improve first? | Add authentication and a user ID to each record, then scope every query to the authenticated user. |
| How would you handle many records? | Add pagination, assess query performance, and test indexes. The current list endpoint returns every matching row. |
| Does the company index make substring search fast? | Not necessarily. A normal index does not guarantee efficient leading-wildcard ILIKE searches; measure before adding a suitable search index. |
| What about SQL injection? | SQLAlchemy builds bound query values instead of concatenating raw SQL. Search still treats percent/underscore as pattern wildcards. |
| What are the limitations? | No stage history, login, pagination, migrations, duplicate prevention, or checked-in tests. Date ordering and whitespace-only text are not checked. |
| What was a challenge? | Pick something you actually worked on. A concrete topic to explain is converting empty date/package fields to null or numbers before API submission. Do not invent a debugging story. |

## Five-minute code walkthrough

1. **ApplicationForm.jsx:** show controlled inputs, shared add/edit behavior, optional-field conversion, and saving/error state.
2. **api.js:** show one POST request, URLSearchParams for filters, and the 204 branch.
3. **schemas.py:** show allowed status values and package_lpa >= 0.
4. **applications.py:** show create → commit → refresh; then a filter and a missing-ID check.
5. **models.py / database.py:** show the primary key, optional columns, and a database session closed in finally.
6. **analytics.py / Dashboard.jsx:** connect the grouped SQL counts to cards and chart data.

## Practice with one example

Add a fictional application as Applied. Explain how it gets an ID and persists in PostgreSQL. Change it to Interview, then Offer. Explain why the dashboard Interview count goes down rather than claiming it remembers the earlier stage.

Try an invalid status in /docs and explain the 422 response. Request an ID that does not exist and explain the 404 response.

## Resume wording

**PlacementTrack | React, FastAPI, PostgreSQL**
- Implemented application management with create, read, update, and delete operations, plus company search and status/job-type filters.
- Connected a React interface to validated FastAPI endpoints and PostgreSQL storage using SQLAlchemy.
- Built a dashboard displaying application status counts and percentages with Recharts.

Use “implemented” or “built” only for work you can honestly claim. Avoid unsupported claims about user counts, performance improvements, production readiness, or historical placement conversion.
