from pydantic import BaseModel

class Msg(BaseModel):
    msg: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: int = None

from .user import User, UserCreate, UserUpdate, UserInDB
from .product import Product, ProductCreate
