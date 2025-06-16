from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.work_session_model import WorkSession, WorkSessionCreate
from db.db import get_session
from typing import List
from datetime import datetime, timedelta, timezone

from models.task_model import Task

router = APIRouter()

@router.post("/sessions/", response_model=WorkSession)
def create_session(session_data: WorkSessionCreate, session: Session = Depends(get_session)):
    start_time_aware = session_data.start_time.astimezone(timezone.utc) if session_data.start_time.tzinfo else session_data.start_time.replace(tzinfo=timezone.utc)
    end_time_aware = session_data.end_time.astimezone(timezone.utc) if session_data.end_time.tzinfo else session_data.end_time.replace(tzinfo=timezone.utc)

    new_session = WorkSession(
        start_time=start_time_aware,
        end_time=end_time_aware,
        type=session_data.type
    )
    session.add(new_session)
    session.commit()
    session.refresh(new_session)
    return new_session

@router.get("/sessions/", response_model=List[WorkSession])
def get_all_sessions(session: Session = Depends(get_session)):
    return session.exec(select(WorkSession)).all()

@router.get("/stats/summary")
def get_summary(session: Session = Depends(get_session)):
    now_utc = datetime.now(timezone.utc)
    today_start = datetime(now_utc.year, now_utc.month, now_utc.day, tzinfo=timezone.utc)
    week_start = today_start - timedelta(days=7)

    tasks_done = session.exec(select(func.count(Task.id)).where(Task.done == True)).scalar()

    sessions_today = session.exec(
        select(WorkSession).where(
            WorkSession.start_time >= today_start,
            WorkSession.type == "work"
        )
    ).all()

    sessions_week = session.exec(
        select(WorkSession).where(
            WorkSession.start_time >= week_start,
            WorkSession.type == "work"
        )
    ).all()

    total_today = sum((s.end_time - s.start_time).total_seconds() for s in sessions_today)
    total_week = sum((s.end_time - s.start_time).total_seconds() for s in sessions_week)

    return {
        "tasks_done": tasks_done,
        "minutes_today": round(total_today / 60),
        "minutes_week": round(total_week / 60)
    }

@router.get("/sessions/daily")
def get_daily_stats(session: Session = Depends(get_session)):
    now_utc = datetime.now(timezone.utc)
    stats = []

    for i in range(6, -1, -1):  # 6 → 0 = 7 derniers jours
        day = now_utc - timedelta(days=i)
        start = datetime(day.year, day.month, day.day, tzinfo=timezone.utc)
        end = start + timedelta(days=1)

        sessions = session.exec(
            select(WorkSession).where(
                WorkSession.start_time >= start,
                WorkSession.start_time < end,
                WorkSession.type == "work"
            )
        ).all()

        total_seconds_for_day = sum((s.end_time - s.start_time).total_seconds() for s in sessions)
        stats.append({
            "date": day.strftime("%d/%m"),
            "hours": round(total_seconds_for_day / 3600, 2)
        })
    return stats