"""extend_categories_with_localized_names_and_nav

Revision ID: b2d3f5a70002
Revises: a1c2e3f40001
Create Date: 2026-07-24 11:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2d3f5a70002'
down_revision: Union[str, None] = 'a1c2e3f40001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add localized names, nav metadata and a slug to categories."""
    op.add_column('categories', sa.Column('name_ja', sa.String(length=100), nullable=True))
    op.add_column('categories', sa.Column('name_en', sa.String(length=100), nullable=True))
    op.add_column('categories', sa.Column('menu_name_ja', sa.String(length=100), nullable=True))
    op.add_column('categories', sa.Column('menu_name_en', sa.String(length=100), nullable=True))
    op.add_column('categories', sa.Column('slug', sa.String(length=120), nullable=True))
    op.add_column('categories', sa.Column('icon', sa.String(), nullable=True))
    op.add_column(
        'categories',
        sa.Column('show_in_nav', sa.Boolean(), server_default=sa.false(), nullable=False),
    )
    op.create_unique_constraint('uq_categories_slug', 'categories', ['slug'])

    # Backfill a slug for any existing rows so nav links always resolve.
    op.execute("UPDATE categories SET slug = 'category-' || id WHERE slug IS NULL")


def downgrade() -> None:
    """Revert the category extensions."""
    op.drop_constraint('uq_categories_slug', 'categories', type_='unique')
    op.drop_column('categories', 'show_in_nav')
    op.drop_column('categories', 'icon')
    op.drop_column('categories', 'slug')
    op.drop_column('categories', 'menu_name_en')
    op.drop_column('categories', 'menu_name_ja')
    op.drop_column('categories', 'name_en')
    op.drop_column('categories', 'name_ja')
