"""Seed script — creates demo user + sample tasks."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import date, timedelta
import uuid
from app.core.database import engine, SessionLocal
from app.core.security import hash_password
from app.models.models import Base, User, Task

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Skip if demo user already exists
if db.query(User).filter(User.email == "mithilesh@demo.com").first():
    print("✅ Seed data already exists.")
    db.close()
    sys.exit(0)

demo = User(
    id=str(uuid.uuid4()),
    name="Mithilesh Singh",
    email="mithilesh@demo.com",
    password_hash=hash_password("demo123"),
    avatar="MS",
    role="Admin",
)
db.add(demo)
db.flush()

today = date.today()

sample_tasks = [
    dict(title="Design new landing page", description="Create wireframes and mockups for the revamped landing page with modern UI", status="todo", priority="high", category="Design", due_date=(today + timedelta(days=3)).isoformat(), tags=["UI", "Design"]),
    dict(title="Build REST API endpoints", description="Implement CRUD endpoints for user and task management with JWT auth", status="in-progress", priority="high", category="Backend", due_date=(today + timedelta(days=2)).isoformat(), tags=["API", "FastAPI"]),
    dict(title="Write unit tests", description="Achieve 80% test coverage across all service modules using pytest", status="todo", priority="medium", category="Testing", due_date=(today + timedelta(days=7)).isoformat(), tags=["Testing", "pytest"]),
    dict(title="Setup CI/CD pipeline", description="Configure GitHub Actions for automated builds and deployments", status="done", priority="medium", category="DevOps", due_date=(today - timedelta(days=1)).isoformat(), tags=["DevOps", "CI/CD"]),
    dict(title="Database schema optimisation", description="Add indexes and optimise slow queries in PostgreSQL", status="in-progress", priority="low", category="Backend", due_date=(today + timedelta(days=5)).isoformat(), tags=["SQLAlchemy", "Performance"]),
    dict(title="User onboarding flow", description="Design and implement a smooth onboarding experience for new users", status="done", priority="high", category="Design", due_date=(today - timedelta(days=2)).isoformat(), tags=["UX", "Frontend"]),
]

for t in sample_tasks:
    db.add(Task(id=str(uuid.uuid4()), assignee_id=demo.id, **t))

db.commit()
db.close()
print("✅ Demo user and sample tasks seeded.")
print("   Email: mithilesh@demo.com | Password: demo123")
