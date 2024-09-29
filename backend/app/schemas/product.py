from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProductBase(BaseModel):
    prompt: str
    product_type: str
    generated_image_url: str
    product_image_url: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ProductOut(BaseModel):
    id: int
    user_id: int
    creator_name: str
    prompt: str
    product_type: str
    generated_image_url: str
    product_image_url: str
    created_at: datetime

    class Config:
        orm_mode = True