from sqlalchemy import Column, ForeignKey, Integer

from app.core.db.database import Base


class ToolCategory(Base):
    __tablename__ = 'tool_categories'

    tool_id = Column(Integer, ForeignKey('tools.id', ondelete='CASCADE'), primary_key=True)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
