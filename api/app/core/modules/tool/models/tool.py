from sqlalchemy import Column, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import relationship

from app.core.db.database import Base
from app.core.modules.tool.models.tool_category import ToolCategory  # noqa: F401
from app.core.modules.tool.models.tool_guide_file import ToolGuideFile  # noqa: F401
from app.core.modules.tool.models.tool_prompt import ToolPrompt  # noqa: F401
from app.core.modules.tool.models.tool_role import ToolRole  # noqa: F401
from app.core.modules.tool.models.tool_step import ToolStep  # noqa: F401


class Tool(Base):
    __tablename__ = 'tools'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(500), nullable=True)
    url = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False, server_default='公開中')
    visibility = Column(String(10), nullable=False, server_default='public')
    login_ids = Column(ARRAY(Text), nullable=True, server_default='{}')
    guide_content = Column(Text, nullable=True)
    admin_memo = Column(Text, nullable=True)
    details = Column(JSONB, nullable=True)
    mcp_name = Column(String(255), nullable=True)
    mcp_config = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    tool_steps = relationship('ToolStep', cascade='all, delete-orphan', lazy='selectin')
    steps = relationship('Step', secondary='tool_steps', back_populates='tools', lazy='selectin')
    tool_categories = relationship('ToolCategory', cascade='all, delete-orphan', lazy='selectin')
    tool_roles = relationship('ToolRole', cascade='all, delete-orphan', lazy='selectin')
    guide_files = relationship('ToolGuideFile', cascade='all, delete-orphan', lazy='selectin', order_by='ToolGuideFile.order')
    prompts = relationship('ToolPrompt', cascade='all, delete-orphan', lazy='selectin', order_by='ToolPrompt.order')

    def __repr__(self):
        return f"<Tool(id={self.id}, name='{self.name}')>"
