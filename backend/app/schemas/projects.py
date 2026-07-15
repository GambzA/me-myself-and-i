from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    description: str | None = None
    image_url: str | None = None
    link_url: str | None = None
    is_investor: bool = False
    display_order: int = 0


class ProjectCreate(ProjectBase):
    category_id: int


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    image_url: str | None = None
    link_url: str | None = None
    is_investor: bool | None = None
    display_order: int | None = None
    category_id: int | None = None


class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ProjectCategoryBase(BaseModel):
    key: str
    label: str
    description: str | None = None
    display_order: int = 0


class ProjectCategoryCreate(ProjectCategoryBase):
    pass


class ProjectCategoryUpdate(BaseModel):
    key: str | None = None
    label: str | None = None
    description: str | None = None
    display_order: int | None = None


class ProjectCategoryOut(ProjectCategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    projects: list[ProjectOut] = []
