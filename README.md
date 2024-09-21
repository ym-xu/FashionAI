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
3. Set up environment variables (including database URL, Cloudflare and SendGrid API keys).
4. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

## API Endpoints

The backend provides several API endpoints, including:

- User authentication: `/api/auth/login`, `/api/auth/register`
- User profile: `/api/users/me`
- Product management: `/api/products/`

For a complete list of endpoints, refer to the FastAPI documentation available at `/docs` when running the server.

## Key Features

1. AI-Powered Image Generation: Utilizes Stable Diffusion XL Lightning model via Cloudflare Workers.
2. User Authentication: Secure login and registration system with email verification.
3. Product Creation: Users can generate images and create product mockups for various items like T-shirts, hoodies, and wall art.
4. Marketplace: A platform for users to list and browse AI-generated fashion products.
5. User Profiles: Customizable user profiles with bio and personal links.
6. Responsive Design: Masonry layout for displaying products and user-generated content.

## Environment Variables

Ensure the following environment variables are set:

- `SENDGRID_API_KEY`: For sending verification emails
- `SENDGRID_SENDER_EMAIL`: Email address for sending verification emails
- Database configuration (e.g., `DATABASE_URL`)
- Cloudflare-related keys for image storage and AI processing

## Contributing

Contributions to FashionAI are welcome. Please ensure that your code adheres to the project's coding standards and include tests for new features.

## License

[Add your license information here]
