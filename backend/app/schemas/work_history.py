from datetime import date

from pydantic import BaseModel, ConfigDict


class WorkHistoryBase(BaseModel):
    role: str
    company: str
    company_note: str | None = None
    start_date: date
    end_date: date | None = None
    display_order: int = 0


class WorkHistoryCreate(WorkHistoryBase):
    pass


class WorkHistoryUpdate(BaseModel):
    role: str | None = None
    company: str | None = None
    company_note: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    display_order: int | None = None


class WorkHistoryOut(WorkHistoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
