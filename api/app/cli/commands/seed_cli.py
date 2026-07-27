import asyncio
import json
import os
from datetime import datetime

import typer
from sqlalchemy import select

from app.core.db.database import AsyncSessionLocal
from app.core.modules.auth.auth_securities import get_password_hash
from app.core.modules.category.models.category import Category
from app.core.modules.step.models.step import Step
from app.core.modules.tool.models.tool import Tool
from app.core.modules.tool.models.tool_category import ToolCategory
from app.core.modules.tool.models.tool_prompt import ToolPrompt, ToolPromptCategory, ToolPromptRole
from app.core.modules.tool.models.tool_role import ToolRole
from app.core.modules.tool.models.tool_step import ToolStep
from app.core.modules.user.models.user import User
from app.core.modules.user.models.user_role import UserRole
from app.core.modules.role.models.role import Role

app = typer.Typer()

def get_json_data(file_name: str):
    paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../site/base/data', file_name)),
        os.path.abspath(os.path.join(os.getcwd(), '../site/base/data', file_name)),
        os.path.abspath(os.path.join(os.getcwd(), 'site/base/data', file_name)),
        rf"c:\Users\ADMIN\Desktop\du an AI\ai-ops-hub\site\base\data\{file_name}"
    ]
    for path in paths:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
    raise FileNotFoundError(f"Could not find mock data file {file_name} in searched paths.")

async def seed_roles_async():
    typer.echo("Seeding roles...")
    roles_data = [
        {"code": "sale", "name": "営業"},
        {"code": "marketing", "name": "マーケティング"},
        {"code": "backoffice", "name": "バックオフィス"},
        {"code": "accounting", "name": "経理"},
        {"code": "admin", "name": "管理者"},
    ]
    async with AsyncSessionLocal() as session:
        for r in roles_data:
            res = await session.execute(select(Role).where(Role.code == r['code']))
            if res.scalars().first():
                continue
            db_role = Role(code=r['code'], name=r['name'])
            session.add(db_role)
        await session.commit()
    typer.echo("Roles seeded successfully!")

async def seed_users_async():
    typer.echo("Seeding users...")
    users_data = get_json_data('users.json')
    async with AsyncSessionLocal() as session:
        for u in users_data:
            res = await session.execute(select(User).where(User.email == u['email']))
            if res.scalars().first():
                continue

            db_user = User(
                email=u['email'],
                password=get_password_hash("password123"),  # Default password
                name=u['name'],
                first_name=u['name'].split(' ')[0] if ' ' in u['name'] else u['name'],
                last_name=u['name'].split(' ')[-1] if ' ' in u['name'] else "",
                last_login=datetime.now()
            )
            session.add(db_user)
            await session.flush()
            session.add(UserRole(user_id=db_user.id, role=u.get('role', 'sale').lower()))
        await session.commit()
    typer.echo("Users seeded successfully!")

CATEGORY_SEED = [
    {"slug": "creative", "name_ja": "クリエイティブ", "name_en": "Creative",
     "menu_name_ja": "クリエイティブハブ", "menu_name_en": "Creative Hub", "order": 1, "has_step_flow": False},
    {"slug": "compliance", "name_ja": "コンプライアンス", "name_en": "Compliance",
     "menu_name_ja": "コンプライアンスハブ", "menu_name_en": "Compliance Hub", "order": 2, "has_step_flow": True},
    {"slug": "data", "name_ja": "データ", "name_en": "Data",
     "menu_name_ja": "データハブ", "menu_name_en": "Data Hub", "order": 3, "has_step_flow": False},
]

async def seed_categories_async(session):
    """Seed categories, returning {slug: id} for whatever ids Postgres assigned."""
    typer.echo("Seeding categories...")
    slug_to_id = {}
    for cat in CATEGORY_SEED:
        res = await session.execute(select(Category).where(Category.slug == cat["slug"]))
        db_cat = res.scalars().first()
        if db_cat is None:
            db_cat = Category(
                slug=cat["slug"],
                name_ja=cat["name_ja"],
                name_en=cat["name_en"],
                menu_name_ja=cat["menu_name_ja"],
                menu_name_en=cat["menu_name_en"],
                order=cat["order"],
                has_step_flow=cat["has_step_flow"],
            )
            session.add(db_cat)
            await session.flush()
        slug_to_id[cat["slug"]] = db_cat.id
    return slug_to_id

async def seed_steps_async(slug_to_id: dict):
    typer.echo("Seeding steps...")
    compliance_id = slug_to_id.get("compliance")
    steps_data = get_json_data('steps.json')
    step_mapping = {}
    async with AsyncSessionLocal() as session:
        for s in steps_data:
            res = await session.execute(select(Step).where(Step.order == s['order']))
            existing = res.scalars().first()
            if existing:
                step_mapping[s['id']] = existing.id
                continue

            db_step = Step(
                category_id=compliance_id,
                order=s['order'],
                icon=s.get('icon'),
                title=s['title'],
                description=s.get('description')
            )
            session.add(db_step)
            # flush() makes Postgres assign the id, so the mapping uses the real value
            # rather than assuming it matches the loop counter.
            await session.flush()
            step_mapping[s['id']] = db_step.id
        await session.commit()
    typer.echo("Steps seeded successfully!")
    return step_mapping

async def seed_tools_async(step_mapping=None):
    typer.echo("Seeding tools...")
    if not step_mapping:
        step_mapping = {}
    
    tools_data = get_json_data('tools.json')

    async with AsyncSessionLocal() as session:
        category_slug_map = await seed_categories_async(session)

        # Resolve the compliance step by its order instead of assuming it landed on id 1.
        compliance_step_id = step_mapping.get(1)
        if compliance_step_id is None:
            res = await session.execute(select(Step).order_by(Step.order).limit(1))
            first_step = res.scalars().first()
            compliance_step_id = first_step.id if first_step else None

        for idx, t in enumerate(tools_data, start=1):
            res = await session.execute(select(Tool).where(Tool.name == t['name']))
            if res.scalars().first():
                continue

            assigned_step_id = compliance_step_id if "compliance" in t.get("category", []) else None

            db_tool = Tool(
                name=t['name'],
                description=t.get('description'),
                icon=t.get('icon'),
                url=t.get('url'),
                status='公開中',
                visibility='public',
                login_ids=[f"user{idx}@company.local"],
                guide_content=f"## 使い方\n\n1. `{t['name']}`を開きます。\n2. ログインを行います。\n3. ガイドラインに従って利用します。",
                admin_memo="Seeded via mock data",
                details={"inputs": ["商談データ"], "outputDescription": "分析レポート"},
            )
            session.add(db_tool)
            await session.flush()

            # Add step
            if assigned_step_id:
                session.add(ToolStep(tool_id=db_tool.id, step_id=assigned_step_id))

            # Add categories
            for cat_slug in t.get("category", []):
                cat_id = category_slug_map.get(cat_slug)
                if cat_id:
                    session.add(ToolCategory(tool_id=db_tool.id, category_id=cat_id))

            # Add default roles (make visible to sale, marketing, backoffice, accounting)
            roles = ["sale", "marketing"]
            if idx % 3 == 0:
                roles.append("backoffice")
            for r in roles:
                session.add(ToolRole(tool_id=db_tool.id, role=r))

            # Add default prompts
            prompt = ToolPrompt(
                tool_id=db_tool.id,
                title="基本プロンプト",
                description="標準的な実行手順テンプレート",
                content="以下のデータに基づいて処理を行ってください。\n\n[※ここにデータをペーストしてください]",
                is_recommended=True,
                order=0
            )
            session.add(prompt)
            await session.flush()

            # Add prompt roles and categories
            for r in roles:
                session.add(ToolPromptRole(prompt_id=prompt.id, role=r))
            for cat_slug in t.get("category", []):
                cat_id = category_slug_map.get(cat_slug)
                if cat_id:
                    session.add(ToolPromptCategory(prompt_id=prompt.id, category_id=cat_id))

        await session.commit()
    typer.echo("Tools seeded successfully!")

async def seed_all_async():
    await seed_roles_async()
    await seed_users_async()
    slug_to_id = await seed_categories_async(AsyncSessionLocal())
    step_map = await seed_steps_async(slug_to_id)
    await seed_tools_async(step_map)

@app.command()
def all():
    """Seed all mock data into the database."""
    asyncio.run(seed_all_async())

@app.command()
def users():
    """Seed users mock data only."""
    asyncio.run(seed_users_async())

@app.command()
def tools():
    """Seed tools mock data only."""
    asyncio.run(seed_tools_async())

@app.command()
def steps():
    """Seed steps mock data only."""
    asyncio.run(seed_steps_async())
