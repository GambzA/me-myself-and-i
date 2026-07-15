from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BlogPostCreate(BaseModel):
    title: str
    slug: str | None = None
    excerpt: str | None = None
    content_markdown: str
    cover_image_url: str | None = None
    published: bool = False


class BlogPostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content_markdown: str | None = None
    cover_image_url: str | None = None
    published: bool | None = None


class BlogPostSummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    excerpt: str | None
    cover_image_url: str | None
    published: bool
    published_at: datetime | None


class BlogPostDetailOut(BlogPostSummaryOut):
    content_markdown: str
    created_at: datetime
    updated_at: datetime
