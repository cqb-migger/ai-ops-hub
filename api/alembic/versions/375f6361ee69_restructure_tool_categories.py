"""restructure_tool_categories

Revision ID: 375f6361ee69
Revises: 20b16d1d140e
Create Date: 2026-06-29 16:03:47.956096

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '375f6361ee69'
down_revision: Union[str, None] = '20b16d1d140e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column('tools', 'category')
    op.alter_column('tools', 'hubs', new_column_name='category')


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('tools', 'category', new_column_name='hubs')
    from sqlalchemy.dialects.postgresql import ARRAY
    op.add_column('tools', sa.Column('category', ARRAY(sa.String()), server_default='{}', nullable=False))
