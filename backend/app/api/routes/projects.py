from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.api.reorder import ReorderRequest, apply_reorder
from app.models.projects import Project, ProjectCategory
from app.models.user import User
from app.schemas.projects import (
    ProjectCategoryCreate,
    ProjectCategoryOut,
    ProjectCategoryUpdate,
    ProjectCreate,
    ProjectOut,
    ProjectUpdate,
)

router = APIRouter(tags=["projects"])


@router.get("/api/project-categories", response_model=list[ProjectCategoryOut])
async def list_project_categories(db: AsyncSession = Depends(get_db)) -> list[ProjectCategory]:
    result = await db.scalars(
        select(ProjectCategory)
        .options(selectinload(ProjectCategory.projects))
        .order_by(ProjectCategory.display_order)
    )
    return list(result.all())


@router.post("/api/project-categories", response_model=ProjectCategoryOut, status_code=status.HTTP_201_CREATED)
async def create_project_category(
    payload: ProjectCategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ProjectCategory:
    category = ProjectCategory(**payload.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category, attribute_names=["projects"])
    return category


@router.put("/api/project-categories/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_project_categories(
    payload: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await apply_reorder(db, ProjectCategory, payload.ids)


@router.put("/api/project-categories/{category_id}", response_model=ProjectCategoryOut)
async def update_project_category(
    category_id: int,
    payload: ProjectCategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ProjectCategory:
    category = await db.get(ProjectCategory, category_id, options=[selectinload(ProjectCategory.projects)])
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project category not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(category, field, value)

    await db.commit()
    await db.refresh(category, attribute_names=["projects"])
    return category


@router.delete("/api/project-categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    category = await db.get(ProjectCategory, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project category not found")

    await db.delete(category)
    await db.commit()


@router.post("/api/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Project:
    project = Project(**payload.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.put("/api/projects/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_projects(
    payload: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    await apply_reorder(db, Project, payload.ids)


@router.put("/api/projects/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Project:
    project = await db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> None:
    project = await db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    await db.delete(project)
    await db.commit()
