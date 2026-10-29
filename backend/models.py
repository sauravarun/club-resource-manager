from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from databases import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    resources = relationship("Resource", back_populates="owner", cascade="all, delete")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    url = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # selectin loads the owner up front, since async can't lazy-load later
    owner = relationship("User", back_populates="resources", lazy="selectin")