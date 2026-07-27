from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.db.database import Base


class Step(Base):
    __tablename__ = 'steps'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order = Column(Integer, nullable=False)
    icon = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)

    category = relationship('Category')
    tools = relationship('Tool', secondary='tool_steps', back_populates='steps', lazy='selectin')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Step(id={self.id}, title='{self.title}', order={self.order})>"
