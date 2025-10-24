from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from api.auth import router as auth_router
from api.farms import router as farms_router
from api.tasks import router as tasks_router
from api.journal import router as journal_router
from api.weather import router as weather_router
from api.users import router as users_router
from api.assistant import router as assistant_router
from api.uploads import router as uploads_router
from api.uploads_no_auth import router as uploads_no_auth_router
from api.journal_no_auth import router as journal_no_auth_router

# Create FastAPI app
app = FastAPI(
    title="AIRRVie - Rice Farming Assistant API",
    description="Backend API for the AIRRVie rice farming assistant application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend development server
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Vite fallback port 1
        "http://127.0.0.1:3001",
        "http://localhost:3002",  # Vite fallback port 2
        "http://127.0.0.1:3002",
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(farms_router)
app.include_router(tasks_router)
app.include_router(journal_router)
app.include_router(weather_router)
app.include_router(users_router)
app.include_router(assistant_router)
app.include_router(uploads_router)
app.include_router(uploads_no_auth_router)
app.include_router(journal_no_auth_router)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "AIRRVie API Server",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "airrvie-api",
        "timestamp": "2025-01-01T00:00:00Z"  # This would be dynamic in production
    }

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "api": "AIRRVie Backend API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "auth": "/api/auth",
            "farms": "/api/farms",
            "tasks": "/api/tasks", 
            "journal": "/api/journal",
            "weather": "/api/weather",
            "users": "/api/users",
            "assistant": "/api/conversations",
            "uploads": "/api/uploads"
        }
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return HTTPException(status_code=404, detail="Endpoint not found")

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
