from datetime import date

from app.models.projects import Project, ProjectCategory
from app.models.skills import Skill, SkillGroup
from app.models.work_history import WorkHistory


async def test_homepage_aggregates_nested_data(client, db_session):
    db_session.add(
        WorkHistory(role="Engineer", company="Acme", start_date=date(2020, 1, 1), display_order=0)
    )

    group = SkillGroup(label="Languages", display_order=0)
    group.skills = [Skill(name="Python", display_order=0)]
    db_session.add(group)

    category = ProjectCategory(key="work", label="From Work", display_order=0)
    category.projects = [Project(title="Cool Project", display_order=0)]
    db_session.add(category)

    await db_session.commit()

    response = await client.get("/api/homepage")
    assert response.status_code == 200

    body = response.json()
    assert body["work_history"][0]["company"] == "Acme"
    assert body["skill_groups"][0]["skills"][0]["name"] == "Python"
    assert body["project_categories"][0]["projects"][0]["title"] == "Cool Project"
