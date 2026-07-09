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

async def seed_users_async():
    typer.echo("Seeding users...")
    users_data = get_json_data('users.json')
    async with AsyncSessionLocal() as session:
        for idx, u in enumerate(users_data, start=1):
            res = await session.execute(select(User).where(User.email == u['email']))
            if res.scalars().first():
                continue
                
            db_user = User(
                id=idx,
                email=u['email'],
                password=get_password_hash("password123"),  # Default password
                name=u['name'],
                first_name=u['name'].split(' ')[0] if ' ' in u['name'] else u['name'],
                last_name=u['name'].split(' ')[-1] if ' ' in u['name'] else "",
                role=u.get('role', 'sale').lower(),  # Align with sale, marketing, admin etc.
                last_login=datetime.now()
            )
            session.add(db_user)
        await session.commit()
    typer.echo("Users seeded successfully!")

async def seed_categories_async(session):
    typer.echo("Seeding categories...")
    categories = [
        {"id": 1, "name": "クリエイティブハブ", "order": 1},
        {"id": 2, "name": "コンプライアンスフロー", "order": 2},
        {"id": 3, "name": "データハブ", "order": 3}
    ]
    for cat in categories:
        res = await session.execute(select(Category).where(Category.id == cat["id"]))
        if not res.scalars().first():
            db_cat = Category(id=cat["id"], name=cat["name"], order=cat["order"])
            session.add(db_cat)
    await session.flush()

async def seed_steps_async():
    typer.echo("Seeding steps...")
    steps_data = get_json_data('steps.json')
    step_mapping = {}
    async with AsyncSessionLocal() as session:
        for idx, s in enumerate(steps_data, start=1):
            res = await session.execute(select(Step).where(Step.order == s['order']))
            existing = res.scalars().first()
            if existing:
                step_mapping[s['id']] = existing.id
                continue
                
            db_step = Step(
                id=idx,
                order=s['order'],
                icon=s.get('icon'),
                title=s['title'],
                description=s.get('description')
            )
            session.add(db_step)
            step_mapping[s['id']] = idx
        await session.commit()
    typer.echo("Steps seeded successfully!")
    return step_mapping

async def seed_tools_async(step_mapping=None):
    typer.echo("Seeding tools...")
    if not step_mapping:
        step_mapping = {}
    
    tools_data = get_json_data('tools.json')
    category_slug_map = {
        "creative": 1,
        "compliance": 2,
        "data": 3
    }

    async with AsyncSessionLocal() as session:
        await seed_categories_async(session)
        
        for idx, t in enumerate(tools_data, start=1):
            res = await session.execute(select(Tool).where(Tool.name == t['name']))
            if res.scalars().first():
                continue

            # Determine compliance step ID if any
            assigned_step_id = None
            if "compliance" in t.get("category", []):
                # Map to first step or randomly
                assigned_step_id = 1

            db_tool = Tool(
                id=idx,
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
    await seed_users_async()
    step_map = await seed_steps_async()
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
