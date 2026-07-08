from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func

from app.core.db.database import Base


class ToolGuideFile(Base):
    __tablename__ = 'tool_guide_files'

    id = Column(Integer, primary_key=True, autoincrement=True)
    tool_id = Column(Integer, ForeignKey('tools.id', ondelete='CASCADE'), nullable=False)
    original_name = Column(String(255), nullable=False)
    stored_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_url = Column(String(500), nullable=True)
    mime_type = Column(String(100), nullable=True)
    file_size = Column(Integer, nullable=True)
    order = Column(Integer, nullable=False, server_default='0')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<ToolGuideFile(id={self.id}, tool_id={self.tool_id}, name='{self.original_name}')>"
