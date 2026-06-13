# TaskFlow — Task Management Dashboard (Python Stack)

A full-stack task management SPA built by **Mithilesh Singh**.

## Tech Stack
| Layer | Technology |
|---|---|
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **ORM** | SQLAlchemy 2.0 |
| **Database** | SQLite (dev) → swap PostgreSQL/MySQL for prod |
| **Auth** | JWT (PyJWT) + bcrypt (passlib) |
| **Validation** | Pydantic v2 |
| **Frontend** | Angular 17, TypeScript, RxJS, SCSS |

## Project Structure
```
task-dashboard-py/
├── backend/
│   ├── main.py              # FastAPI app + CORS + routes
│   ├── seed.py              # Creates demo user + sample tasks
│   ├── requirements.txt
│   └── app/
│       ├── core/
│       │   ├── database.py  # SQLAlchemy engine + session
│       │   ├── security.py  # JWT + bcrypt helpers
│       │   └── deps.py      # get_current_user dependency
│       ├── models/
│       │   └── models.py    # User + Task ORM models
│       ├── schemas/
│       │   └── schemas.py   # Pydantic request/response schemas
│       └── routers/
│           ├── auth.py      # /api/auth/* endpoints
│           └── tasks.py     # /api/tasks + /api/analytics
└── frontend/                # Angular SPA
```

## Getting Started

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python seed.py          # Creates DB + demo data
uvicorn main:app --reload --port 8000
# API:  http://localhost:8000
# Docs: http://localhost:8000/docs   ← interactive Swagger UI
```

### 2. Frontend
```bash
cd frontend
npm install
npm start               # → http://localhost:4200
```

## Demo Credentials
| Field | Value |
|---|---|
| Email | mithilesh@demo.com |
| Password | demo123 |

## API Endpoints
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | ✗ | Create account |
| POST | /api/auth/login | ✗ | Get JWT token |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/tasks | ✓ | List tasks (filterable) |
| POST | /api/tasks | ✓ | Create task |
| PUT | /api/tasks/{id} | ✓ | Update task |
| DELETE | /api/tasks/{id} | ✓ | Delete task |
| GET | /api/analytics | ✓ | Stats + category breakdown |

Interactive docs available at `http://localhost:8000/docs`

## Switching to PostgreSQL
In `backend/app/core/database.py`, change:
```python
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/taskflow"
```
And install: `pip install psycopg2-binary`
No other code changes needed — SQLAlchemy handles the rest.

And ofc made with ❤️ by Mithilesh
