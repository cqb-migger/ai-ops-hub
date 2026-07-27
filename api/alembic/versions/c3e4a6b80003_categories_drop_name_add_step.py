"""categories: seed localized names, add has_step_flow, drop name & show_in_nav

Revision ID: c3e4a6b80003
Revises: b2d3f5a70002
Create Date: 2026-07-24 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3e4a6b80003'
down_revision: Union[str, None] = 'b2d3f5a70002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # New flag: does this category render the compliance-style step review flow?
    op.add_column(
        'categories',
        sa.Column('has_step_flow', sa.Boolean(), server_default=sa.false(), nullable=False),
    )

    # Seed the three built-in categories with slugs, localized names, menu labels
    # and the step flag *before* dropping the `name` column we match on.
    seeds = [
        ('コンプライアンス', 'compliance', 'コンプライアンス', 'Compliance', 'コンプライアンスハブ', 'Compliance Hub', True),
        ('クリエイティブ', 'creative', 'クリエイティブ', 'Creative', 'クリエイティブハブ', 'Creative Hub', False),
        ('データ', 'data', 'データ', 'Data', 'データハブ', 'Data Hub', False),
    ]
    for kw, slug, nja, nen, mja, men, step in seeds:
        op.execute(
            sa.text(
                """
                UPDATE categories SET
                    slug = :slug,
                    name_ja = :nja,
                    name_en = :nen,
                    menu_name_ja = :mja,
                    menu_name_en = :men,
                    has_step_flow = :step
                WHERE name LIKE :kw
                """
            ).bindparams(slug=slug, nja=nja, nen=nen, mja=mja, men=men, step=step, kw=f'%{kw}%')
        )

    # For any other existing category, backfill localized/menu names from `name`
    # so nothing renders blank once `name` is gone.
    op.execute("UPDATE categories SET name_ja = name WHERE name_ja IS NULL")
    op.execute("UPDATE categories SET name_en = name WHERE name_en IS NULL")
    op.execute("UPDATE categories SET menu_name_ja = COALESCE(menu_name_ja, name_ja)")
    op.execute("UPDATE categories SET menu_name_en = COALESCE(menu_name_en, name_en)")

    # Drop the now-unused columns (name's unique index is dropped with the column).
    op.drop_column('categories', 'name')
    op.drop_column('categories', 'show_in_nav')


def downgrade() -> None:
    op.add_column('categories', sa.Column('show_in_nav', sa.Boolean(), server_default=sa.false(), nullable=False))
    op.add_column('categories', sa.Column('name', sa.String(length=100), nullable=True))
    # Restore a best-effort name from the Japanese label; make it unique again.
    op.execute("UPDATE categories SET name = COALESCE(name_ja, name_en, slug)")
    op.alter_column('categories', 'name', nullable=False)
    op.create_unique_constraint('categories_name_key', 'categories', ['name'])
    op.drop_column('categories', 'has_step_flow')
