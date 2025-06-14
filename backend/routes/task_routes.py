from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.task_model import Task
from db.db import get_session

router = APIRouter()

@router.get("/tasks", response_model=list[Task])
def get_tasks(session: Session = Depends(get_session)):
    return session.exec(select(Task)).all()

@router.post("/tasks", response_model=Task)
def create_task(task: Task, session: Session = Depends(get_session)):
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    session.delete(task)
    session.commit()
    return {"message": "Tâche supprimée"}

@router.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task: Task, session: Session = Depends(get_session)):
    existing_task = session.get(Task, task_id)
    if not existing_task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    existing_task.title = task.title
    existing_task.done = task.done
    session.add(existing_task)
    session.commit()
    session.refresh(existing_task)
    return existing_task

@router.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    return task