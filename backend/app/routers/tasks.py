from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
import uuid

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, Task
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskOut, Analytics

router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/tasks", response_model=List[TaskOut])
def list_tasks(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Task).filter(Task.assignee_id == current_user.id)
    if status and status != "all":
        q = q.filter(Task.status == status)
    if priority and priority != "all":
        q = q.filter(Task.priority == priority)
    if category and category != "all":
        q = q.filter(Task.category == category)
    if search:
        q = q.filter(
            Task.title.ilike(f"%{search}%") | Task.description.ilike(f"%{search}%")
        )
    tasks = q.order_by(Task.created_at.desc()).all()
    return [TaskOut.model_validate(t) for t in tasks]


@router.post("/tasks", response_model=TaskOut, status_code=201)
def create_task(
    body: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(
        id=str(uuid.uuid4()),
        assignee_id=current_user.id,
        **body.model_dump(),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return TaskOut.model_validate(task)


@router.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    body: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.assignee_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return TaskOut.model_validate(task)


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.assignee_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Deleted"}


@router.get("/analytics", response_model=Analytics)
def analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks = db.query(Task).filter(Task.assignee_id == current_user.id).all()
    today = date.today().isoformat()

    total = len(tasks)
    todo = sum(1 for t in tasks if t.status == "todo")
    in_progress = sum(1 for t in tasks if t.status == "in-progress")
    done = sum(1 for t in tasks if t.status == "done")
    overdue = sum(1 for t in tasks if t.status != "done" and t.due_date < today)
    high_priority = sum(1 for t in tasks if t.priority == "high")

    by_category: dict = {}
    for t in tasks:
        by_category[t.category] = by_category.get(t.category, 0) + 1

    completion_rate = round((done / total) * 100) if total > 0 else 0

    return Analytics(
        total=total,
        todo=todo,
        in_progress=in_progress,
        done=done,
        overdue=overdue,
        high_priority=high_priority,
        by_category=by_category,
        completion_rate=completion_rate,
    )
