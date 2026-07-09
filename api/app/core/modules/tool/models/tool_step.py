from sqlalchemy import Column, ForeignKey, Integer

from app.core.db.database import Base


class ToolStep(Base):
    __tablename__ = 'tool_steps'

    tool_id = Column(Integer, ForeignKey('tools.id', ondelete='CASCADE'), primary_key=True)
    step_id = Column(Integer, ForeignKey('steps.id', ondelete='CASCADE'), primary_key=True)
