import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.blog import BlogPost
from app.models.user import User
from app.schemas.blog import BlogPostCreate, BlogPostDetailOut, BlogPostSummaryOut, BlogPostUpdate

router = APIRouter(tags=["blog"])


def _slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "post"


async def _unique_slug(db: AsyncSession, title: str, exclude_id: int | None = None) -> str:
    base = _slugify(title)
    slug = base
    suffix = 2
    while True:
        query = select(BlogPost.id).where(BlogPost.slug == slug)
        if exclude_id is not None:
            query = query.where(BlogPost.id != exclude_id)
        existing = await db.scalar(query)
        if existing is None:
            return slug
        slug = f"{base}-{suffix}"
        suffix += 1


# ── Public ──────────────────────────────────────────────


@router.get("/api/blog", response_model=list[BlogPostSummaryOut])
async def list_published_posts(db: AsyncSession = Depends(get_db)) -> list[BlogPost]:
    result = await db.scalars(
        select(BlogPost).where(BlogPost.published.is_(True)).order_by(BlogPost.published_at.desc())
    )
    return list(result.all())


@router.get("/api/blog/{slug}", response_model=BlogPostDetailOut)
async def get_published_post(slug: str, db: AsyncSession = Depends(get_db)) -> BlogPost:
    post = await db.scalar(select(BlogPost).where(BlogPost.slug == slug, BlogPost.published.is_(True)))
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


# ── Admin ───────────────────────────────────────────────


@router.get("/api/admin/blog", response_model=list[BlogPostSummaryOut])
async def admin_list_posts(
    db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)
) -> list[BlogPost]:
    result = await db.scalars(select(BlogPost).order_by(BlogPost.created_at.desc()))
    return list(result.all())


@router.get("/api/admin/blog/{post_id}", response_model=BlogPostDetailOut)
async def admin_get_post(
    post_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)
) -> BlogPost:
    post = await db.get(BlogPost, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


@router.post("/api/admin/blog", response_model=BlogPostDetailOut, status_code=status.HTTP_201_CREATED)
async def admin_create_post(
    payload: BlogPostCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> BlogPost:
    data = payload.model_dump()
    data["slug"] = await _unique_slug(db, data["slug"] or data["title"])
    if data["published"]:
        data["published_at"] = datetime.now(timezone.utc)

    post = BlogPost(**data)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post


@router.put("/api/admin/blog/{post_id}", response_model=BlogPostDetailOut)
async def admin_update_post(
    post_id: int,
    payload: BlogPostUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
) -> BlogPost:
    post = await db.get(BlogPost, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    data = payload.model_dump(exclude_unset=True)

    if "slug" in data:
        data["slug"] = await _unique_slug(db, data["slug"] or data.get("title", post.title), exclude_id=post_id)

    if data.get("published") and not post.published:
        data["published_at"] = datetime.now(timezone.utc)

    for field, value in data.items():
        setattr(post, field, value)

    await db.commit()
    await db.refresh(post)
    return post


@router.delete("/api/admin/blog/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_post(
    post_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)
) -> None:
    post = await db.get(BlogPost, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    await db.delete(post)
    await db.commit()
