from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.favorite import Favorite
from app import models

def create_favorite(db: Session, user_id: int, product_id: int):
    try:
        db_favorite = Favorite(user_id=user_id, product_id=product_id)
        db.add(db_favorite)
        db.commit()
        db.refresh(db_favorite)
        return db_favorite
    except IntegrityError:
        db.rollback()
        raise ValueError("You have already liked this product")

def remove_favorite(db: Session, user_id: int, product_id: int):
    favorite = db.query(models.Favorite).filter(
        models.Favorite.user_id == user_id,
        models.Favorite.product_id == product_id
    ).first()
    if favorite:
        db.delete(favorite)
        db.commit()
    else:
        raise ValueError("Favorite not found")
