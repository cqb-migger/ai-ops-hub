from typing import List, Optional, Tuple

from fastapi import HTTPException, status
from sqlalchemy import delete, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.modules.category.models.category import Category
from app.core.modules.tool.models.tool import Tool
from app.core.modules.tool.models.tool_category import ToolCategory
from app.core.modules.tool.models.tool_guide_file import ToolGuideFile
from app.core.modules.tool.models.tool_prompt import ToolPrompt, ToolPromptCategory, ToolPromptRole
from app.core.modules.tool.models.tool_role import ToolRole
from app.core.modules.tool.models.tool_step import ToolStep
from app.core.modules.tool.models.user_tool_favorite import UserToolFavorite
from app.core.modules.tool.tool_schemas import PromptCreate, ToolCreate, ToolUpdate
from app.core.modules.user.models.user import User


async def _format_categories(category_ids: List[int], cats_map: dict) -> List[dict]:
    return [
        {
            'id': cid,
            'name': cats_map.get(cid, {}).get('name', ''),
            'order': cats_map.get(cid, {}).get('order', 0)
        }
        for cid in category_ids
        if cid in cats_map
    ]


async def _enrich_tool(db: AsyncSession, tool: Tool, user_id: Optional[int] = None) -> dict:
    """Build full dictionary for ToolDetailResponse."""
    cat_ids = [tc.category_id for tc in tool.tool_categories]
    cats_map: dict = {}
    if cat_ids:
        res = await db.execute(select(Category).where(Category.id.in_(cat_ids)))
        cats_map = {c.id: {'name': c.name, 'order': c.order} for c in res.scalars().all()}

    prompts = []
    for p in tool.prompts:
        p_cat_ids = [pc.category_id for pc in p.prompt_categories]
        p_cats_map: dict = {}
        if p_cat_ids:
            res2 = await db.execute(select(Category).where(Category.id.in_(p_cat_ids)))
            p_cats_map = {c.id: {'name': c.name, 'order': c.order} for c in res2.scalars().all()}
        
        prompts.append({
            'id': p.id,
            'tool_id': p.tool_id,
            'title': p.title,
            'description': p.description,
            'content': p.content,
            'is_recommended': p.is_recommended,
            'order': p.order,
            'roles': [pr.role for pr in p.prompt_roles],
            'categories': await _format_categories(p_cat_ids, p_cats_map),
            'created_at': p.created_at,
            'updated_at': p.updated_at,
        })

    is_favorite = False
    if user_id:
        fav_res = await db.execute(
            select(UserToolFavorite.tool_id)
            .where(
                UserToolFavorite.user_id == user_id,
                UserToolFavorite.tool_id == tool.id
            )
        )
        is_favorite = fav_res.scalar() is not None

    return {
        **{c: getattr(tool, c) for c in [
            'id', 'name', 'description', 'icon', 'url', 'status', 'visibility',
            'login_ids', 'guide_content', 'admin_memo', 'details',
            'mcp_name', 'mcp_type', 'mcp_stdio_command', 'mcp_stdio_args',
            'mcp_stdio_env', 'mcp_stdio_env_passthrough', 'mcp_stdio_work_dir',
            'mcp_http_url', 'mcp_http_bearer_token_env', 'mcp_http_headers',
            'mcp_http_headers_from_env',
            'created_at', 'updated_at',
        ]},
        'login_ids': tool.login_ids or [],
        'step_ids': [ts.step_id for ts in tool.tool_steps],
        'is_favorite': is_favorite,
        'categories': await _format_categories(cat_ids, cats_map),
        'roles': [tr.role for tr in tool.tool_roles],
        'guide_files': [
            {c: getattr(gf, c) for c in [
                'id', 'tool_id', 'original_name', 'stored_name',
                'file_path', 'file_url', 'mime_type', 'file_size', 'order', 'created_at',
            ]}
            for gf in tool.guide_files
        ],
        'prompts': prompts,
    }


async def get_tools_service(
    db: AsyncSession,
    category_id: Optional[int] = None,
    hub: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    step_id: Optional[int] = None,
    sort: Optional[str] = 'name_asc',
    visibility: Optional[str] = 'public',
    skip: int = 0,
    limit: int = 20,
    user_id: Optional[int] = None,
) -> Tuple[List[dict], int]:
    """List tools with filters and pagination."""
    base_q = (
        select(Tool)
        .where(Tool.deleted_at.is_(None))
        .options(
            selectinload(Tool.tool_categories),
            selectinload(Tool.tool_roles),
            selectinload(Tool.tool_steps),
        )
    )

    if visibility and visibility != 'all':
        base_q = base_q.where(Tool.visibility == visibility)

    if user_id:
        user_res = await db.execute(select(User).where(User.id == user_id))
        user = user_res.scalars().first()
        if user:
            user_role = user.role.lower()
            if user_role == 'admin':
                if role:
                    role_sub = select(ToolRole.tool_id).where(func.lower(ToolRole.role) == role.lower())
                    no_restriction_sub = select(Tool.id).where(~Tool.id.in_(select(ToolRole.tool_id)))
                    base_q = base_q.where(or_(Tool.id.in_(role_sub), Tool.id.in_(no_restriction_sub)))
            else:
                role_sub = select(ToolRole.tool_id).where(func.lower(ToolRole.role) == user_role)
                base_q = base_q.where(Tool.id.in_(role_sub))
    else:
        if role:
            role_sub = select(ToolRole.tool_id).where(func.lower(ToolRole.role) == role.lower())
            no_restriction_sub = select(Tool.id).where(~Tool.id.in_(select(ToolRole.tool_id)))
            base_q = base_q.where(or_(Tool.id.in_(role_sub), Tool.id.in_(no_restriction_sub)))

    if category_id:
        sub = select(ToolCategory.tool_id).where(ToolCategory.category_id == category_id)
        base_q = base_q.where(Tool.id.in_(sub))
    elif hub:
        slug_map = {'creative': 'クリエイティブ', 'compliance': 'コンプライアンス', 'data': 'データ'}
        keyword = slug_map.get(hub.lower(), hub)
        cat_sub = select(Category.id).where(Category.name.ilike(f'%{keyword}%'))
        tc_sub = select(ToolCategory.tool_id).where(ToolCategory.category_id.in_(cat_sub))
        base_q = base_q.where(Tool.id.in_(tc_sub))

    # Role query parameter is handled conditionally under user role check above

    if search:
        like = f'%{search}%'
        base_q = base_q.where(or_(Tool.name.ilike(like), Tool.description.ilike(like)))

    if step_id:
        step_sub = select(ToolStep.tool_id).where(ToolStep.step_id == step_id)
        base_q = base_q.where(Tool.id.in_(step_sub))

    count_q = select(func.count()).select_from(base_q.subquery())
    total = (await db.execute(count_q)).scalar_one()

    if sort == 'favorite' and user_id:
        # Favorites first, then name A→Z
        is_fav_col = select(UserToolFavorite.tool_id).where(
            UserToolFavorite.tool_id == Tool.id,
            UserToolFavorite.user_id == user_id
        ).exists()
        q = base_q.order_by(is_fav_col.desc(), func.lower(Tool.name).asc())
    elif sort == 'newest':
        q = base_q.order_by(Tool.id.desc())
    else:
        # Default: name A→Z
        q = base_q.order_by(func.lower(Tool.name).asc())

    result = await db.execute(q.offset(skip).limit(limit))
    tools = list(result.scalars().all())

    fav_tool_ids = set()
    if user_id and tools:
        tool_ids = [t.id for t in tools]
        fav_res = await db.execute(
            select(UserToolFavorite.tool_id)
            .where(
                UserToolFavorite.user_id == user_id,
                UserToolFavorite.tool_id.in_(tool_ids)
            )
        )
        fav_tool_ids = set(fav_res.scalars().all())

    all_cat_ids = list({tc.category_id for t in tools for tc in t.tool_categories})
    cats_map: dict = {}
    if all_cat_ids:
        res = await db.execute(select(Category).where(Category.id.in_(all_cat_ids)))
        cats_map = {c.id: {'name': c.name, 'order': c.order} for c in res.scalars().all()}

    items = []
    for tool in tools:
        cat_ids = [tc.category_id for tc in tool.tool_categories]
        items.append({
            'id': tool.id,
            'name': tool.name,
            'description': tool.description,
            'icon': tool.icon,
            'url': tool.url,
            'status': tool.status,
            'visibility': tool.visibility,
            'step_ids': [ts.step_id for ts in tool.tool_steps],
            'login_ids': tool.login_ids or [],
            'is_favorite': tool.id in fav_tool_ids,
            'categories': [
                {'id': cid, 'name': cats_map.get(cid, {}).get('name', ''), 'order': cats_map.get(cid, {}).get('order', 0)}
                for cid in cat_ids if cid in cats_map
            ],
            'roles': [tr.role for tr in tool.tool_roles],
            'mcp_name': tool.mcp_name,
            'mcp_type': tool.mcp_type,
            'mcp_stdio_command': tool.mcp_stdio_command,
            'mcp_stdio_args': tool.mcp_stdio_args or [],
            'mcp_stdio_env': tool.mcp_stdio_env or [],
            'mcp_stdio_env_passthrough': tool.mcp_stdio_env_passthrough or [],
            'mcp_stdio_work_dir': tool.mcp_stdio_work_dir,
            'mcp_http_url': tool.mcp_http_url,
            'mcp_http_bearer_token_env': tool.mcp_http_bearer_token_env,
            'mcp_http_headers': tool.mcp_http_headers or [],
            'mcp_http_headers_from_env': tool.mcp_http_headers_from_env or [],
            'created_at': tool.created_at,
            'updated_at': tool.updated_at,
        })
    return items, total


async def get_tool_service(db: AsyncSession, tool_id: int, user_id: Optional[int] = None) -> Optional[dict]:
    """Get full tool detail."""
    result = await db.execute(
        select(Tool)
        .where(Tool.id == tool_id, Tool.deleted_at.is_(None))
        .options(
            selectinload(Tool.tool_categories),
            selectinload(Tool.tool_roles),
            selectinload(Tool.tool_steps),
            selectinload(Tool.guide_files),
            selectinload(Tool.prompts).selectinload(ToolPrompt.prompt_roles),
            selectinload(Tool.prompts).selectinload(ToolPrompt.prompt_categories),
        )
    )
    tool = result.scalars().first()
    if not tool:
        return None

    if user_id:
        user_res = await db.execute(select(User).where(User.id == user_id))
        user = user_res.scalars().first()
        if user:
            user_role = user.role.lower()
            if user_role == 'admin':
                pass
            else:
                tool_roles = [r.role.lower() for r in tool.tool_roles]
                if user_role not in tool_roles:
                    return None

    return await _enrich_tool(db, tool, user_id=user_id)


async def _upsert_relations(db: AsyncSession, tool_id: int, tool_in: ToolCreate | ToolUpdate):
    """Delete and re-insert tool_categories, tool_roles, and optionally prompts."""
    fields_set = getattr(tool_in, 'model_fields_set', set())
    is_create = isinstance(tool_in, ToolCreate)

    # Categories
    if is_create or 'category_ids' in fields_set:
        await db.execute(delete(ToolCategory).where(ToolCategory.tool_id == tool_id))
        for cid in (tool_in.category_ids or []):
            db.add(ToolCategory(tool_id=tool_id, category_id=cid))

    # Roles
    if is_create or 'roles' in fields_set:
        await db.execute(delete(ToolRole).where(ToolRole.tool_id == tool_id))
        for r in (tool_in.roles or []):
            db.add(ToolRole(tool_id=tool_id, role=r))

    # Steps
    if is_create or 'step_ids' in fields_set:
        await db.execute(delete(ToolStep).where(ToolStep.tool_id == tool_id))
        for sid in (tool_in.step_ids or []):
            db.add(ToolStep(tool_id=tool_id, step_id=sid))

    # Prompts
    if is_create or 'prompts' in fields_set:
        prompts_list: Optional[List[PromptCreate]] = tool_in.prompts
        if prompts_list is not None:
            await db.execute(delete(ToolPrompt).where(ToolPrompt.tool_id == tool_id))
            for idx, p in enumerate(prompts_list):
                prompt = ToolPrompt(
                    tool_id=tool_id,
                    title=p.title,
                    description=p.description,
                    content=p.content,
                    is_recommended=p.is_recommended,
                    order=p.order if p.order is not None else idx,
                )
                db.add(prompt)
                await db.flush()
                for role in (p.roles or []):
                    db.add(ToolPromptRole(prompt_id=prompt.id, role=role))
                for cid in (p.category_ids or []):
                    db.add(ToolPromptCategory(prompt_id=prompt.id, category_id=cid))

    # Guide files
    if is_create or 'guide_files' in fields_set:
        guide_files_list = tool_in.guide_files
        if guide_files_list is not None:
            await db.execute(delete(ToolGuideFile).where(ToolGuideFile.tool_id == tool_id))
            for idx, gf in enumerate(guide_files_list):
                db_gf = ToolGuideFile(
                    tool_id=tool_id,
                    original_name=gf.original_name,
                    stored_name=gf.stored_name,
                    file_path=gf.file_path,
                    file_url=gf.file_url,
                    mime_type=gf.mime_type,
                    file_size=gf.file_size,
                    order=gf.order if gf.order is not None else idx
                )
                db.add(db_gf)


async def create_tool_service(db: AsyncSession, tool_in: ToolCreate) -> dict:
    """Create tool + categories + roles + prompts in a single transaction."""
    db_tool = Tool(
        name=tool_in.name,
        description=tool_in.description,
        icon=tool_in.icon,
        url=tool_in.url,
        status=tool_in.status or '公開中',
        visibility=tool_in.visibility or 'public',
        login_ids=tool_in.login_ids or [],
        guide_content=tool_in.guide_content,
        admin_memo=tool_in.admin_memo,
        details=tool_in.details,
        mcp_name=tool_in.mcp_name,
        mcp_type=tool_in.mcp_type,
        mcp_stdio_command=tool_in.mcp_stdio_command,
        mcp_stdio_args=tool_in.mcp_stdio_args,
        mcp_stdio_env=tool_in.mcp_stdio_env,
        mcp_stdio_env_passthrough=tool_in.mcp_stdio_env_passthrough,
        mcp_stdio_work_dir=tool_in.mcp_stdio_work_dir,
        mcp_http_url=tool_in.mcp_http_url,
        mcp_http_bearer_token_env=tool_in.mcp_http_bearer_token_env,
        mcp_http_headers=tool_in.mcp_http_headers,
        mcp_http_headers_from_env=tool_in.mcp_http_headers_from_env,
    )
    try:
        db.add(db_tool)
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tool name already exists"
        )

    tool_id = db_tool.id

    try:
        await _upsert_relations(db, tool_id, tool_in)
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tool name already exists"
        )
    db.expire_all()

    return await get_tool_service(db, tool_id)


async def update_tool_service(db: AsyncSession, tool_id: int, tool_in: ToolUpdate) -> Optional[dict]:
    """Update tool + rebuild join tables."""
    result = await db.execute(select(Tool).where(Tool.id == tool_id, Tool.deleted_at.is_(None)))
    db_tool = result.scalars().first()
    if not db_tool:
        return None

    scalar_fields = ['name', 'description', 'icon', 'url', 'status', 'visibility',
                     'login_ids', 'guide_content', 'admin_memo', 'details',
                     'mcp_name', 'mcp_type', 'mcp_stdio_command', 'mcp_stdio_args',
                     'mcp_stdio_env', 'mcp_stdio_env_passthrough', 'mcp_stdio_work_dir',
                     'mcp_http_url', 'mcp_http_bearer_token_env', 'mcp_http_headers',
                     'mcp_http_headers_from_env']
    update_data = tool_in.model_dump(exclude_unset=True, exclude={'category_ids', 'roles', 'prompts', 'step_ids'})
    for field in scalar_fields:
        if field in update_data:
            setattr(db_tool, field, update_data[field])

    try:
        db.add(db_tool)
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tool name already exists"
        )

    try:
        await _upsert_relations(db, tool_id, tool_in)
        await db.flush()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tool name already exists"
        )
    db.expire_all()

    return await get_tool_service(db, tool_id)


async def delete_tool_service(db: AsyncSession, tool_id: int) -> bool:
    """Soft delete a tool."""
    result = await db.execute(select(Tool).where(Tool.id == tool_id, Tool.deleted_at.is_(None)))
    db_tool = result.scalars().first()
    if not db_tool:
        return False
    db_tool.deleted_at = func.now()
    db.add(db_tool)
    await db.flush()
    return True


async def toggle_favorite_service(db: AsyncSession, tool_id: int, user_id: int) -> Optional[dict]:
    """Toggle favorite status of a tool for a user and return status."""
    tool_check = await db.execute(select(Tool.id).where(Tool.id == tool_id, Tool.deleted_at.is_(None)))
    if not tool_check.scalar():
        return None

    result = await db.execute(
        select(UserToolFavorite)
        .where(UserToolFavorite.user_id == user_id, UserToolFavorite.tool_id == tool_id)
    )
    fav = result.scalars().first()

    if fav:
        await db.delete(fav)
        await db.flush()
        is_favorite = False
    else:
        new_fav = UserToolFavorite(user_id=user_id, tool_id=tool_id)
        db.add(new_fav)
        await db.flush()
        is_favorite = True

    return {"is_favorite": is_favorite}
