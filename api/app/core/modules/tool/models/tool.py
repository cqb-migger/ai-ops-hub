import uuid
from sqlalchemy import Column, String, Text, DateTime, func, JSON
from sqlalchemy.dialects.postgresql import ARRAY
from app.core.db.database import Base

class Tool(Base):
    __tablename__ = 'tools'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    url = Column(String, nullable=True)
    status = Column(String, default='公開中', nullable=False)
    category = Column(ARRAY(String), default=list, nullable=False)
    details = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<Tool(id='{self.id}', name='{self.name}')>"
