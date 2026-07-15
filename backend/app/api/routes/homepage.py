from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db
from app.models.projects import ProjectCategory
from app.models.skills import SkillGroup
from app.models.work_history import WorkHistory
from app.schemas.homepage import HomepageOut

router = APIRouter(tags=["homepage"])


@router.get("/api/homepage", response_model=HomepageOut)
async def get_homepage(db: AsyncSession = Depends(get_db)) -> HomepageOut:
    work_history = (
        await db.scalars(select(WorkHistory).order_by(WorkHistory.display_order))
    ).all()
    skill_groups = (
        await db.scalars(
            select(SkillGroup).options(selectinload(SkillGroup.skills)).order_by(SkillGroup.display_order)
        )
    ).all()
    project_categories = (
        await db.scalars(
            select(ProjectCategory)
            .options(selectinload(ProjectCategory.projects))
            .order_by(ProjectCategory.display_order)
        )
    ).all()

    return HomepageOut(
        work_history=list(work_history),
        skill_groups=list(skill_groups),
        project_categories=list(project_categories),
    )
