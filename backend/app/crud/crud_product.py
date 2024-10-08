from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate

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

def get_products_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.user_id == user_id).offset(skip).limit(limit).all()