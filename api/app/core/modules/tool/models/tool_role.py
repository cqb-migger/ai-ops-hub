from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.db.database import Base


class ToolRole(Base):
    __tablename__ = 'tool_roles'

    tool_id = Column(Integer, ForeignKey('tools.id', ondelete='CASCADE'), primary_key=True)
    role = Column(String(50), primary_key=True)
