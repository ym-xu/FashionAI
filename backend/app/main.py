from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, products
from app.core.config import settings
import httpx
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fashionai.pages.dev/"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api/users")
app.include_router(products.router, prefix="/api/products", tags=["products"])

@app.post("/api/upload-to-cloudflare")
async def upload_to_cloudflare(file: UploadFile = File(...)):
    print(f"Uploading file: {file.filename}")
    cloudflare_url = f"https://api.cloudflare.com/client/v4/accounts/{os.getenv('CLOUDFLARE_ACCOUNT_ID')}/images/v1"
    headers = {
        "Authorization": f"Bearer {os.getenv('CLOUDFLARE_API_KEY')}"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            files = {"file": (file.filename, await file.read(), file.content_type)}
            print(f"Sending request to Cloudflare: {cloudflare_url}")
            response = await client.post(cloudflare_url, headers=headers, files=files)
        
        response.raise_for_status()
        data = response.json()
        print(f"Cloudflare response: {data}")
        
        if not data.get('success'):
            error_message = data.get('errors', [{}])[0].get('message', 'Unknown error')
            raise HTTPException(status_code=response.status_code, detail=error_message)
        
        image_url = f"https://imagedelivery.net/{os.getenv('CLOUDFLARE_ACCOUNT_HASH')}/{data['result']['id']}/public"
        print(f"Image URL: {image_url}")
        return {"imageUrl": image_url}
    except httpx.HTTPStatusError as e:
        error_data = e.response.json()
        error_message = error_data.get('errors', [{}])[0].get('message', 'Unknown error')
        print(f"HTTP error occurred: {e.response.status_code} - {error_message}")
        raise HTTPException(status_code=e.response.status_code, detail=error_message)
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)