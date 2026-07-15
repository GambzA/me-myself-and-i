from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    name: str
    is_accent: bool = False
    display_order: int = 0


class SkillCreate(SkillBase):
    skill_group_id: int


class SkillUpdate(BaseModel):
    name: str | None = None
    is_accent: bool | None = None
    display_order: int | None = None
    skill_group_id: int | None = None


class SkillOut(SkillBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class SkillGroupBase(BaseModel):
    label: str
    display_order: int = 0


class SkillGroupCreate(SkillGroupBase):
    pass


class SkillGroupUpdate(BaseModel):
    label: str | None = None
    display_order: int | None = None


class SkillGroupOut(SkillGroupBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    skills: list[SkillOut] = []
