from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.api.reorder import ReorderRequest, apply_reorder
from app.models.user import User
from app.models.work_history import WorkHistory
from app.schemas.work_history import WorkHistoryCreate, WorkHistoryOut, WorkHistoryUpdate

router = APIRouter(prefix="/api/work-history", tags=["work-history"])


@router.get("", response_model=list[WorkHistoryOut])
async def list_work_history(db: AsyncSession = Depends(get_db)) -> list[WorkHistory]:
    result = await db.scalars(select(WorkHistory).order_by(WorkHistory.display_order))
    return list(result.all())


@router.post("", response_model=WorkHistoryOut, status_code=status.HTTP_201_CREATED)
async def create_work_history(
    payload: WorkHistoryCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> WorkHistory:
    entry = WorkHistory(**payload.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_work_history(
    payload: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await apply_reorder(db, WorkHistory, payload.ids)


@router.put("/{entry_id}", response_model=WorkHistoryOut)
async def update_work_history(
    entry_id: int,
    payload: WorkHistoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> WorkHistory:
    entry = await db.get(WorkHistory, entry_id)
    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work history entry not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_history(
    entry_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    entry = await db.get(WorkHistory, entry_id)
    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work history entry not found")

    await db.delete(entry)
    await db.commit()
