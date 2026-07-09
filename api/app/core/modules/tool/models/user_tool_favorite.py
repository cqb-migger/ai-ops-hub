from sqlalchemy import Column, ForeignKey, Integer

from app.core.db.database import Base


class UserToolFavorite(Base):
    __tablename__ = 'user_tool_favorites'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    tool_id = Column(Integer, ForeignKey('tools.id', ondelete='CASCADE'), primary_key=True)
