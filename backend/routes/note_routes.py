from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.note_model import Note
from db.db import get_session
from datetime import datetime

router = APIRouter()

@router.get("/notes", response_model=list[Note])
def get_notes(session: Session = Depends(get_session)):
    return session.exec(select(Note)).all()

@router.post("/notes", response_model=Note)
def create_note(note: Note, session: Session = Depends(get_session)):
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
def update_note(note_id: int, updated_note: Note, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note introuvable")
    note.content = updated_note.content
    note.updated_at = datetime.utcnow()
    session.add(note)
    session.commit()
    session.refresh(note)
    return note
