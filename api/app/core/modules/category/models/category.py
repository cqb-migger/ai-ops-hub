from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from app.core.db.database import Base


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order = Column(Integer, nullable=False, server_default='0')

    # Localized category names.
    name_ja = Column(String(100), nullable=True)
    name_en = Column(String(100), nullable=True)
    # Localized sidebar menu labels (required for new categories at the API layer).
    menu_name_ja = Column(String(100), nullable=True)
    menu_name_en = Column(String(100), nullable=True)
    # Nav metadata: slug for /hub/[slug] routing and an icon.
    slug = Column(String(120), unique=True, nullable=True)
    icon = Column(String, nullable=True)
    # When true the hub page renders the compliance-style step review flow.
    has_step_flow = Column(Boolean, nullable=False, server_default='false')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Category(id={self.id}, slug='{self.slug}')>"
