from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.note_model import Note, NoteCreate
from db.db import get_session
from datetime import datetime, timezone

router = APIRouter()

@router.get("/notes", response_model=list[Note])
def get_notes(session: Session = Depends(get_session)):
    return session.exec(select(Note)).all()

@router.post("/notes", response_model=Note)
def create_note(note_create: NoteCreate, session: Session = Depends(get_session)):
    created_at_aware = note_create.created_at.astimezone(timezone.utc) if note_create.created_at.tzinfo else note_create.created_at.replace(tzinfo=timezone.utc)
    updated_at_aware = note_create.updated_at.astimezone(timezone.utc) if note_create.updated_at.tzinfo else note_create.updated_at.replace(tzinfo=timezone.utc)

    note = Note(
        content=note_create.content,
        created_at=created_at_aware,
        updated_at=updated_at_aware
    )
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@router.delete("/notes/{note_id}")
def delete_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note introuvable")
    session.delete(note)
    session.commit()
    return {"message": "Note supprimée"}

@router.put("/notes/{note_id}", response_model=Note)
def update_note(note_id: int, updated_note_data: NoteCreate, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note introuvable")

    note.content = updated_note_data.content
    note.updated_at = datetime.now(timezone.utc)

    session.add(note)
    session.commit()
    session.refresh(note)
    return note