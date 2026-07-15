from pydantic import BaseModel

from app.schemas.projects import ProjectCategoryOut
from app.schemas.skills import SkillGroupOut
from app.schemas.work_history import WorkHistoryOut


class HomepageOut(BaseModel):
    work_history: list[WorkHistoryOut]
    skill_groups: list[SkillGroupOut]
    project_categories: list[ProjectCategoryOut]
