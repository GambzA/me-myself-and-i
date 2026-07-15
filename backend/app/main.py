from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import auth, blog, homepage, projects, skills, uploads, work_history
from app.core.config import settings

app = FastAPI(title="Roi Gamba Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(auth.router)
app.include_router(homepage.router)
app.include_router(work_history.router)
app.include_router(skills.router)
app.include_router(projects.router)
app.include_router(blog.router)
app.include_router(uploads.router)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
