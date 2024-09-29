from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.base_class import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    username = Column(String(50))
    bio = Column(Text)
    personal_link = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    products = relationship("Product", back_populates="user")