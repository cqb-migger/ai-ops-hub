"""add_mcp_fields_to_tools

Revision ID: 534f7072898d
Revises: b9657c2aec00
Create Date: 2026-07-10 10:26:44.783164

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '534f7072898d'
down_revision: Union[str, None] = 'b9657c2aec00'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    from sqlalchemy.dialects.postgresql import ARRAY, JSONB
    op.add_column('tools', sa.Column('mcp_name', sa.String(length=255), nullable=True))
    op.add_column('tools', sa.Column('mcp_type', sa.String(length=50), nullable=True))
    op.add_column('tools', sa.Column('mcp_stdio_command', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_stdio_args', ARRAY(sa.Text()), nullable=True, server_default='{}'))
    op.add_column('tools', sa.Column('mcp_stdio_env', JSONB(), nullable=True))
    op.add_column('tools', sa.Column('mcp_stdio_env_passthrough', ARRAY(sa.Text()), nullable=True, server_default='{}'))
    op.add_column('tools', sa.Column('mcp_stdio_work_dir', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_url', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_bearer_token_env', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_headers', JSONB(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_headers_from_env', JSONB(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('tools', 'mcp_http_headers_from_env')
    op.drop_column('tools', 'mcp_http_headers')
    op.drop_column('tools', 'mcp_http_bearer_token_env')
    op.drop_column('tools', 'mcp_http_url')
    op.drop_column('tools', 'mcp_stdio_work_dir')
    op.drop_column('tools', 'mcp_stdio_env_passthrough')
    op.drop_column('tools', 'mcp_stdio_env')
    op.drop_column('tools', 'mcp_stdio_args')
    op.drop_column('tools', 'mcp_stdio_command')
    op.drop_column('tools', 'mcp_type')
    op.drop_column('tools', 'mcp_name')
