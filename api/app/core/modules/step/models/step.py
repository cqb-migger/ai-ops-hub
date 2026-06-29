from sqlalchemy import Column, String, Integer, Text, DateTime, func
from app.core.db.database import Base

class Step(Base):
    __tablename__ = 'steps'

    id = Column(String, primary_key=True)  # Keeps custom ID formats like step-1, step-<timestamp>
    order = Column(Integer, nullable=False)
    icon = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Step(id='{self.id}', title='{self.title}', order={self.order})>"
