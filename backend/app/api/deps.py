from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User

__all__ = ["get_db", "get_current_user"]


async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    token = request.cookies.get(settings.cookie_name)
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if not token:
        raise unauthorized

    subject = decode_access_token(token)
    if subject is None:
        raise unauthorized

    user = await db.scalar(select(User).where(User.id == int(subject)))
    if user is None:
        raise unauthorized

    return user
