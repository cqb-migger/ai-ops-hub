from sqlalchemy import Column, ForeignKey, Integer, String

from app.core.db.database import Base


class UserRole(Base):
    """Join table: a user can hold multiple role codes."""

    __tablename__ = 'user_roles'

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    role = Column(String(50), primary_key=True)
