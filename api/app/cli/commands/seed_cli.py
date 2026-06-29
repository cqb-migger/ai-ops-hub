import asyncio
import os
import json
from datetime import datetime
import typer
from sqlalchemy import select

from app.core.db.database import AsyncSessionLocal
from app.core.modules.user.models.user import User
from app.core.modules.tool.models.tool import Tool
from app.core.modules.step.models.step import Step
from app.core.modules.auth.auth_securities import get_password_hash

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
        for u in users_data:
            res = await session.execute(select(User).where(User.email == u['email']))
            if res.scalars().first():
                continue
                
            db_user = User(
                id=int(u['id']),
                email=u['email'],
                password=get_password_hash("password123"),  # Default password
                name=u['name'],
                first_name=u['name'].split(' ')[0] if ' ' in u['name'] else u['name'],
                last_name=u['name'].split(' ')[-1] if ' ' in u['name'] else "",
                role=u.get('role', 'Member'),
                last_login=datetime.now()
            )
            session.add(db_user)
        await session.commit()
    typer.echo("Users seeded successfully!")

async def seed_tools_async():
    typer.echo("Seeding tools...")
    tools_data = get_json_data('tools.json')
    async with AsyncSessionLocal() as session:
        for t in tools_data:
            res = await session.execute(select(Tool).where(Tool.name == t['name']))
            if res.scalars().first():
                continue
                
            db_tool = Tool(
                id=t['id'],
                name=t['name'],
                description=t.get('description'),
                icon=t.get('icon'),
                url=t.get('url'),
                status='公開中',
                category=t.get('category', []),
                details=t.get('details')
            )
            session.add(db_tool)
        await session.commit()
    typer.echo("Tools seeded successfully!")

async def seed_steps_async():
    typer.echo("Seeding steps...")
    steps_data = get_json_data('steps.json')
    async with AsyncSessionLocal() as session:
        for s in steps_data:
            res = await session.execute(select(Step).where(Step.id == s['id']))
            if res.scalars().first():
                continue
                
            db_step = Step(
                id=s['id'],
                order=s['order'],
                icon=s.get('icon'),
                title=s['title'],
                description=s.get('description')
            )
            session.add(db_step)
        await session.commit()
    typer.echo("Steps seeded successfully!")

async def seed_all_async():
    await seed_users_async()
    await seed_tools_async()
    await seed_steps_async()

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
