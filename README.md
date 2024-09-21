# FashionAI

FashionAI is an innovative platform that combines AI-powered image generation with e-commerce functionality, allowing users to create and sell unique fashion products.

## Project Overview

FashionAI enables users to generate custom fashion designs using AI, create product mockups, and list them in a marketplace. The platform integrates advanced AI image generation with a user-friendly interface for a seamless creative experience.

## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios for API requests

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL database
- SendGrid for email services

### AI and Image Processing
- Cloudflare Workers for AI image generation
- Stable Diffusion XL Lightning model for text-to-image generation
- Cloudflare Images for image storage and management

## Setup and Installation

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables by copying `.env.example` to `.env` and filling in the values.
4. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

## API Endpoints

The backend provides several API endpoints, including:

- User authentication: `/api/auth/login`, `/api/auth/register`
- User profile: `/api/users/me`
- Product management: `/api/products/`
- File upload: `/api/upload-to-cloudflare`

For a complete list of endpoints, refer to the FastAPI documentation available at `/docs` when running the server.

## Image Storage

The project uses Cloudflare Images for storing user-generated images. The `/api/upload-to-cloudflare` endpoint handles file uploads to Cloudflare's service.

## CORS Configuration

The backend is configured to allow CORS for the frontend running on `http://localhost:3000`. If you need to change this, update the `allow_origins` parameter in the `app.add_middleware()` call in `main.py`.

## Key Features

1. User Authentication: Secure login and registration system.
2. Profile Management: Users can create and edit their profiles.
3. AI-Powered Image Generation: Utilizes Stable Diffusion XL Lightning model via Cloudflare Workers for text-to-image generation.
4. Studio Interface: A user-friendly interface for creating AI-generated fashion designs.
5. Product Preview: Users can preview their generated designs on various product types.
6. Responsive Design: Ensures a seamless experience across different devices.

## Upcoming Features

1. Marketplace Interface: A platform for users to list and browse AI-generated fashion products.
2. Product Publishing: Ability to publish created products to the marketplace.
3. Favorites System: Users can mark and save their favorite designs.
4. Messaging Center: Communication system for users.
5. Recommendation System: Personalized product recommendations for users.

## Environment Variables

Ensure the following environment variables are set in your `.env` file:

- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_API_KEY`: Your Cloudflare API key
- `CLOUDFLARE_ACCOUNT_HASH`: Your Cloudflare account hash
- `DYNAMIC_MOCKUPS_API_KEY`: API key for Dynamic Mockups
- `DATABASE_URL`: URL for your PostgreSQL database
- `SECRET_KEY`: Secret key for JWT token generation

You can use the provided `.env.example` file as a template.
