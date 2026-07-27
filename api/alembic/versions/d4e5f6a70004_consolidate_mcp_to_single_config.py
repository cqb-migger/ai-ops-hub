"""consolidate mcp columns to single mcp_config

Revision ID: d4e5f6a70004
Revises: c3e4a6b80003
Create Date: 2026-07-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a70004'
down_revision: Union[str, None] = 'c3e4a6b80003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new single column
    op.add_column('tools', sa.Column('mcp_config', sa.Text(), nullable=True))

    # Drop old granular columns
    op.drop_column('tools', 'mcp_type')
    op.drop_column('tools', 'mcp_stdio_command')
    op.drop_column('tools', 'mcp_stdio_args')
    op.drop_column('tools', 'mcp_stdio_env')
    op.drop_column('tools', 'mcp_stdio_env_passthrough')
    op.drop_column('tools', 'mcp_stdio_work_dir')
    op.drop_column('tools', 'mcp_http_url')
    op.drop_column('tools', 'mcp_http_bearer_token_env')
    op.drop_column('tools', 'mcp_http_headers')
    op.drop_column('tools', 'mcp_http_headers_from_env')


def downgrade() -> None:
    # Re-create old columns
    op.add_column('tools', sa.Column('mcp_type', sa.String(50), nullable=True))
    op.add_column('tools', sa.Column('mcp_stdio_command', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_stdio_args', postgresql.ARRAY(sa.Text()), nullable=True, server_default='{}'))
    op.add_column('tools', sa.Column('mcp_stdio_env', postgresql.JSONB(), nullable=True))
    op.add_column('tools', sa.Column('mcp_stdio_env_passthrough', postgresql.ARRAY(sa.Text()), nullable=True, server_default='{}'))
    op.add_column('tools', sa.Column('mcp_stdio_work_dir', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_url', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_bearer_token_env', sa.Text(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_headers', postgresql.JSONB(), nullable=True))
    op.add_column('tools', sa.Column('mcp_http_headers_from_env', postgresql.JSONB(), nullable=True))

    # Drop new column
    op.drop_column('tools', 'mcp_config')
