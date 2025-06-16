from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

class WorkSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Stocker toutes les dates en UTC
    start_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    end_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    type: str  # 'work' ou 'break'

class WorkSessionCreate(SQLModel):
    start_time: datetime
    end_time: datetime
    type: str