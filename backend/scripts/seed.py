import asyncio
from datetime import date

from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.db.session import async_session_maker
from app.models.projects import Project, ProjectCategory
from app.models.skills import Skill, SkillGroup
from app.models.user import User
from app.models.work_history import WorkHistory

WORK_HISTORY = [
    dict(
        role="Software Development Engineer in Test",
        company="Comrise",
        company_note="→ Willis Towers Watson",
        start_date=date(2025, 5, 1),
        end_date=None,
        display_order=0,
    ),
    dict(
        role="Software Automation Engineer II",
        company="TrustArc, Inc.",
        company_note=None,
        start_date=date(2024, 6, 1),
        end_date=date(2025, 5, 1),
        display_order=1,
    ),
    dict(
        role="Software Developer II · QA Automation Engineer",
        company="Bizmates Philippines, Inc.",
        company_note=None,
        start_date=date(2022, 5, 1),
        end_date=date(2024, 5, 1),
        display_order=2,
    ),
    dict(
        role="Software Engineer · Lead Engineer",
        company="Atlantis System's Technologies Filipinas, Inc.",
        company_note=None,
        start_date=date(2017, 8, 1),
        end_date=date(2022, 5, 1),
        display_order=3,
    ),
]

SKILL_GROUPS = [
    ("Programming & Scripting", ["Java", "Python", "C#", "PHP", "JavaScript", "TypeScript"], False),
    ("Databases", ["PostgreSQL", "MySQL", "T-SQL"], False),
    ("DevOps & CI/CD", ["AWS CodeBuild", "Azure Pipelines", "Jenkins", "Docker", "Git"], False),
    ("Frameworks", ["Node.js", "Vue.js", "Laravel", "Maven", "Tailwind", "Bootstrap"], False),
    ("Cloud", ["AWS", "Azure", "Digital Ocean", "Google Cloud"], False),
    (
        "Testing",
        ["End-to-End", "Regression Testing", "Load Testing", "API Testing", "Unit Testing", "Smoke Testing"],
        False,
    ),
    ("Automated Testing", ["Playwright", "Selenium"], True),
    ("AI", ["Agentic Workflows", "Github Copilot", "Claude Code", "Azdo MCP Servers"], True),
]

PROJECT_CATEGORIES = [
    dict(
        key="work",
        label="From Work",
        description="Projects built during my professional career — enterprise systems, automation frameworks, and QA pipelines.",
        display_order=0,
        projects=[
            dict(
                title="Atlantis Online Reservation System",
                description="Atlantis System's Technologies Filipinas, Corp.",
                image_url="/assets/ORS.png",
                link_url="https://atlantis.asia/services/hotel-booking-system/",
            ),
            dict(
                title="Cookie Consent Manager",
                description="TrustArc Inc.",
                image_url="/assets/trustarc.png",
                link_url="https://trustarc.com/products/consent-consumer-rights/cookie-consent-manager/",
            ),
            dict(
                title="AXIS - Extended Job Catalog",
                description="Willis Towers Watson",
                image_url="/assets/wtw.png",
                link_url="https://www.wtwco.com/en-ph/insights/campaigns/salary-survey-participation",
            ),
        ],
    ),
    dict(
        key="me",
        label="From Me",
        description="Freelance work and personal client projects — bringing ideas to life independently.",
        display_order=1,
        projects=[
            dict(
                title="Two Seasons Resorts Website",
                description="Website Revamp using Wordpress PHP, Astra Pro",
                image_url="/assets/twoseasons.png",
                link_url="https://twoseasonsresorts.com/",
            ),
            dict(
                title="Itmiro Website",
                description="New website for Itmiro restaurant made with Wordpress PHP, and Tailwind CSS",
                image_url="/assets/itmiro.png",
                link_url="https://itmiro.com/",
            ),
            dict(
                title="Scrub PH",
                description="Scrub.ph helps you book verified cleaning companies and freelance cleaners with organized schedules, secure payments, and proper booking records.",
                image_url="/assets/scrub.png",
                link_url="https://scrub.ph/",
                is_investor=True,
            ),
        ],
    ),
    dict(
        key="us",
        label="From Us",
        description="Passion projects built with the power of Agentic Engineering and collaborative AI workflows.",
        display_order=2,
        projects=[
            dict(
                title="Booking Engine",
                description="Upcoming SaaS Booking Engine for growing hospitality industry in Bicol",
                image_url="/assets/booking-engine.png",
            ),
            dict(
                title="PropTrack",
                description="PropTrack, a property management tool for real estate professionals.",
                image_url="/assets/proptrack.png",
            ),
        ],
    ),
]


async def seed_admin_user(session) -> None:
    if not settings.admin_email or not settings.admin_password:
        print("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed.")
        return

    existing = await session.scalar(select(User).where(User.email == settings.admin_email))
    if existing is not None:
        print(f"Admin user {settings.admin_email} already exists — skipping.")
        return

    session.add(User(email=settings.admin_email, hashed_password=hash_password(settings.admin_password)))
    print(f"Created admin user {settings.admin_email}.")


async def seed_work_history(session) -> None:
    existing = await session.scalar(select(WorkHistory.id))
    if existing is not None:
        print("Work history already seeded — skipping.")
        return

    for entry in WORK_HISTORY:
        session.add(WorkHistory(**entry))
    print(f"Seeded {len(WORK_HISTORY)} work history entries.")


async def seed_skills(session) -> None:
    existing = await session.scalar(select(SkillGroup.id))
    if existing is not None:
        print("Skills already seeded — skipping.")
        return

    for order, (label, skill_names, is_accent) in enumerate(SKILL_GROUPS):
        group = SkillGroup(label=label, display_order=order)
        group.skills = [
            Skill(name=name, is_accent=is_accent, display_order=i) for i, name in enumerate(skill_names)
        ]
        session.add(group)
    print(f"Seeded {len(SKILL_GROUPS)} skill groups.")


async def seed_projects(session) -> None:
    existing = await session.scalar(select(ProjectCategory.id))
    if existing is not None:
        print("Project categories already seeded — skipping.")
        return

    for category_data in PROJECT_CATEGORIES:
        projects_data = category_data.pop("projects")
        category = ProjectCategory(**category_data)
        category.projects = [
            Project(**{**project_data, "display_order": i}) for i, project_data in enumerate(projects_data)
        ]
        session.add(category)
    print(f"Seeded {len(PROJECT_CATEGORIES)} project categories.")


async def main() -> None:
    async with async_session_maker() as session:
        await seed_admin_user(session)
        await seed_work_history(session)
        await seed_skills(session)
        await seed_projects(session)
        await session.commit()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
