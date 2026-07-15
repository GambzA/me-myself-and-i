from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SkillGroup(Base):
    __tablename__ = "skill_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(255))
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    skills: Mapped[list["Skill"]] = relationship(
        back_populates="skill_group", order_by="Skill.display_order", cascade="all, delete-orphan"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    skill_group_id: Mapped[int] = mapped_column(ForeignKey("skill_groups.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))
    is_accent: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    skill_group: Mapped["SkillGroup"] = relationship(back_populates="skills")
