from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.api.reorder import ReorderRequest, apply_reorder
from app.models.skills import Skill, SkillGroup
from app.models.user import User
from app.schemas.skills import (
    SkillCreate,
    SkillGroupCreate,
    SkillGroupOut,
    SkillGroupUpdate,
    SkillOut,
    SkillUpdate,
)

router = APIRouter(tags=["skills"])


@router.get("/api/skill-groups", response_model=list[SkillGroupOut])
async def list_skill_groups(db: AsyncSession = Depends(get_db)) -> list[SkillGroup]:
    result = await db.scalars(
        select(SkillGroup).options(selectinload(SkillGroup.skills)).order_by(SkillGroup.display_order)
    )
    return list(result.all())


@router.post("/api/skill-groups", response_model=SkillGroupOut, status_code=status.HTTP_201_CREATED)
async def create_skill_group(
    payload: SkillGroupCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> SkillGroup:
    group = SkillGroup(**payload.model_dump())
    db.add(group)
    await db.commit()
    await db.refresh(group, attribute_names=["skills"])
    return group


@router.put("/api/skill-groups/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_skill_groups(
    payload: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await apply_reorder(db, SkillGroup, payload.ids)


@router.put("/api/skill-groups/{group_id}", response_model=SkillGroupOut)
async def update_skill_group(
    group_id: int,
    payload: SkillGroupUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> SkillGroup:
    group = await db.get(SkillGroup, group_id, options=[selectinload(SkillGroup.skills)])
    if group is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill group not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(group, field, value)

    await db.commit()
    await db.refresh(group, attribute_names=["skills"])
    return group


@router.delete("/api/skill-groups/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill_group(
    group_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    group = await db.get(SkillGroup, group_id)
    if group is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill group not found")

    await db.delete(group)
    await db.commit()


@router.post("/api/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
async def create_skill(
    payload: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Skill:
    skill = Skill(**payload.model_dump())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


@router.put("/api/skills/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_skills(
    payload: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await apply_reorder(db, Skill, payload.ids)


@router.put("/api/skills/{skill_id}", response_model=SkillOut)
async def update_skill(
    skill_id: int,
    payload: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Skill:
    skill = await db.get(Skill, skill_id)
    if skill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(skill, field, value)

    await db.commit()
    await db.refresh(skill)
    return skill


@router.delete("/api/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    skill = await db.get(Skill, skill_id)
    if skill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")

    await db.delete(skill)
    await db.commit()
