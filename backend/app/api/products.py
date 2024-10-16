from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from sqlalchemy.orm import Session
from app.crud import product as crud_product, crud_favorite
from app.schemas import Product, ProductCreate, ProductOut
from app.api import deps
from app import models
from app.models import User
import os
import httpx
from tenacity import retry, stop_after_attempt, wait_fixed
import logging
from app.schemas.product import ProductLike
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=Product)
def create_product(
    product: ProductCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return crud_product.create_product(db=db, product=product, user_id=current_user.id)

@router.get("/", response_model=list[ProductOut])
def get_products(
    db: Session = Depends(deps.get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    product_type: str = Query(None),
    search: str = Query(None)
):
    products_with_creator = crud_product.get_products(db, skip=skip, limit=limit, product_type=product_type, search=search)
    logger.info(f"Products with creator: {products_with_creator}")
    return [ProductOut(
        id=product.id,
        user_id=product.user_id,
        creator_name=creator_name,
        prompt=product.prompt,
        product_type=product.product_type,
        generated_image_url=product.generated_image_url,
        product_image_url=product.product_image_url,
        created_at=product.created_at
    ) for product, creator_name in products_with_creator]

@router.get("/user/", response_model=list[Product])
def read_user_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    products = crud_product.get_products_by_user(db=db, user_id=current_user.id, skip=skip, limit=limit)
    return products

@router.post("/generate-product-image")
async def generate_product_image(
    data: dict,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    try:
        dynamic_mockups_url = 'https://app.dynamicmockups.com/api/v1/renders'
        dynamic_mockups_api_key = os.getenv('DYNAMIC_MOCKUPS_API_KEY')

        if not dynamic_mockups_api_key:
            raise HTTPException(status_code=500, detail="Dynamic Mockups API key not found")

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': dynamic_mockups_api_key
        }

        print(f"Sending request to Dynamic Mockups: {dynamic_mockups_url}")
        print(f"Request data: {data}")

        @retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
        async def call_dynamic_mockups_api(client, url, data, headers):
            response = await client.post(url, json=data, headers=headers)
            response.raise_for_status()
            return response.json()

        async with httpx.AsyncClient(timeout=60.0) as client:
            result = await call_dynamic_mockups_api(client, dynamic_mockups_url, data, headers)

        print(f"Dynamic Mockups response: {result}")
        return result
    except httpx.ReadTimeout:
        print("Request to Dynamic Mockups timed out after retries")
        raise HTTPException(status_code=504, detail="Request to Dynamic Mockups timed out after retries")
    except httpx.HTTPStatusError as e:
        print(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.get("/user/created", response_model=list[ProductOut])
def get_user_created_products(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    products = crud_product.get_products_by_user(db, user_id=current_user.id)
    return [ProductOut(
        id=product.id,
        user_id=product.user_id,
        creator_name=current_user.username,
        prompt=product.prompt,
        product_type=product.product_type,
        generated_image_url=product.generated_image_url,
        product_image_url=product.product_image_url,
        created_at=product.created_at
    ) for product in products]

@router.get("/user/favorites", response_model=list[ProductOut])
def get_user_favorite_products(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    products = crud_product.get_favorite_products(db, user_id=current_user.id)
    return [ProductOut(
        id=product.id,
        user_id=product.user_id,
        creator_name=product.user.username,
        prompt=product.prompt,
        product_type=product.product_type,
        generated_image_url=product.generated_image_url,
        product_image_url=product.product_image_url,
        created_at=product.created_at
    ) for product in products]

@router.post("/like", response_model=dict)
def like_product(
    product_like: ProductLike,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    try:
        favorite = crud_favorite.create_favorite(db, user_id=current_user.id, product_id=product_like.product_id)
        return {"status": "success", "message": "Product liked successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error liking product: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/unlike", response_model=dict)
def unlike_product(
    product_like: ProductLike,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    try:
        crud_favorite.remove_favorite(db, user_id=current_user.id, product_id=product_like.product_id)
        return {"status": "success", "message": "Product unliked successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error unliking product: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
