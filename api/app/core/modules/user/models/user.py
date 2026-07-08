from sqlalchemy import Column, DateTime, Integer, String, func

from app.core.db.database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)
    name = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    role = Column(String, default='sale', nullable=False)
    avatar_url = Column(String, nullable=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    is_active = Column(Integer, default=1, nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
