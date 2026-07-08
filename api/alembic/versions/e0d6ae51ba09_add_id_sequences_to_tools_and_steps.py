"""add_id_sequences_to_tools_and_steps

Revision ID: e0d6ae51ba09
Revises: c34d443b864f
Create Date: 2026-07-08 09:09:35.747859

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e0d6ae51ba09'
down_revision: Union[str, None] = 'c34d443b864f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Create sequences for tools and steps
    op.execute("CREATE SEQUENCE IF NOT EXISTS tools_id_seq;")
    op.execute("CREATE SEQUENCE IF NOT EXISTS steps_id_seq;")

    # 2. Set serial value to the current max id
    op.execute("SELECT setval('tools_id_seq', COALESCE((SELECT MAX(id) FROM tools), 0) + 1, false);")
    op.execute("SELECT setval('steps_id_seq', COALESCE((SELECT MAX(id) FROM steps), 0) + 1, false);")

    # 3. Set sequence default on id column
    op.execute("ALTER TABLE tools ALTER COLUMN id SET DEFAULT nextval('tools_id_seq');")
    op.execute("ALTER TABLE steps ALTER COLUMN id SET DEFAULT nextval('steps_id_seq');")

    # 4. Bind sequences to the columns
    op.execute("ALTER SEQUENCE tools_id_seq OWNED BY tools.id;")
    op.execute("ALTER SEQUENCE steps_id_seq OWNED BY steps.id;")


def downgrade() -> None:
    """Downgrade schema."""
    # 1. Remove default constraints
    op.execute("ALTER TABLE tools ALTER COLUMN id DROP DEFAULT;")
    op.execute("ALTER TABLE steps ALTER COLUMN id DROP DEFAULT;")

    # 2. Drop sequences
    op.execute("DROP SEQUENCE IF EXISTS tools_id_seq;")
    op.execute("DROP SEQUENCE IF EXISTS steps_id_seq;")
