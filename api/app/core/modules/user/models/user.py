from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.db.database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    name = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    is_active = Column(Integer, default=1, nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # A user can hold multiple roles (via the user_roles join table).
    user_roles = relationship(
        'UserRole', cascade='all, delete-orphan', lazy='selectin'
    )

    @property
    def roles(self) -> list:
        """All role codes assigned to the user."""
        return [ur.role for ur in self.user_roles]

    @property
    def role(self) -> str:
        """
        Primary role for backward compatibility: 'admin' wins if present,
        otherwise the first assigned role, defaulting to 'sale'.
        """
        codes = self.roles
        if 'admin' in codes:
            return 'admin'
        return codes[0] if codes else 'sale'

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
