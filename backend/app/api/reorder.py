from pydantic import BaseModel
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession


class ReorderRequest(BaseModel):
    ids: list[int]


async def apply_reorder(db: AsyncSession, model, ids: list[int]) -> None:
    for index, item_id in enumerate(ids):
        await db.execute(update(model).where(model.id == item_id).values(display_order=index))
    await db.commit()
