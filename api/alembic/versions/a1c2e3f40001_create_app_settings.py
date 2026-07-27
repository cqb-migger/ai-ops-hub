"""create_app_settings

Revision ID: a1c2e3f40001
Revises: 1b631c8765f2
Create Date: 2026-07-24 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1c2e3f40001'
down_revision: Union[str, None] = '1b631c8765f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the app_settings table and seed the single default row."""
    op.create_table(
        'app_settings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('app_name', sa.String(), server_default='AI Navigator', nullable=False),
        sa.Column('logo_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )

    # Seed the singleton row (id=1) so the app always has branding to read.
    op.execute(
        "INSERT INTO app_settings (id, app_name) VALUES (1, 'AI Navigator') "
        "ON CONFLICT (id) DO NOTHING"
    )


def downgrade() -> None:
    """Drop the app_settings table."""
    op.drop_table('app_settings')
