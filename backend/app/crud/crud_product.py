from sqlalchemy.orm import Session, joinedload
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate
from app.models.favorite import Favorite

def create_product(db: Session, product: ProductCreate, user_id: int):
    db_product = Product(
        user_id=user_id,
        prompt=product.prompt,
        product_type=product.product_type,
        generated_image_url=product.generated_image_url,
        product_image_url=product.product_image_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 100, product_type: str = None, search: str = None):
    query = db.query(Product, User.username.label('creator_name')).join(User, Product.user_id == User.id)
    if product_type:
        query = query.filter(Product.product_type == product_type)
    if search:
        query = query.filter(
            (Product.prompt.ilike(f"%{search}%")) |
            (User.username.ilike(f"%{search}%"))
        )
    return query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

def get_products_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.user_id == user_id).order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

def get_favorite_products(db: Session, user_id: int):
    return db.query(Product).join(Favorite).filter(Favorite.user_id == user_id).options(
        joinedload(Product.user)
    ).all()