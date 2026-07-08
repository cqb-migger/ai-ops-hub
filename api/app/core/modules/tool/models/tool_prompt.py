from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.db.database import Base


class ToolPromptRole(Base):
    __tablename__ = 'tool_prompt_roles'

    prompt_id = Column(Integer, ForeignKey('tool_prompts.id', ondelete='CASCADE'), primary_key=True)
    role = Column(String(50), primary_key=True)

class ToolPromptCategory(Base):
    __tablename__ = 'tool_prompt_categories'

    prompt_id = Column(Integer, ForeignKey('tool_prompts.id', ondelete='CASCADE'), primary_key=True)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)

class ToolPrompt(Base):
    __tablename__ = 'tool_prompts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    tool_id = Column(Integer, ForeignKey('tools.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    is_recommended = Column(Boolean, nullable=False, server_default='false')
    order = Column(Integer, nullable=False, server_default='0')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    prompt_roles = relationship('ToolPromptRole', cascade='all, delete-orphan', lazy='selectin')
    prompt_categories = relationship('ToolPromptCategory', cascade='all, delete-orphan', lazy='selectin')

    def __repr__(self):
        return f"<ToolPrompt(id={self.id}, title='{self.title}')>"
