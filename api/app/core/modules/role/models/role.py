from sqlalchemy import Column, DateTime, Integer, String, func
from app.core.db.database import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    # Localized display names (fallback to `name`).
    name_ja = Column(String(100), nullable=True)
    name_en = Column(String(100), nullable=True)
    description = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Role(id={self.id}, code='{self.code}')>"
