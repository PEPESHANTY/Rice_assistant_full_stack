from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
import asyncpg
import json

from database.config import get_database
from utils.auth import (
    hash_password, verify_password, create_access_token, 
    verify_token, generate_otp, verify_otp
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

# Pydantic models for request/response
class UserSignup(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str
    name: str
    language: str = "vi"

class UserLogin(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str

class LoginResponse(BaseModel):
    message: str
    user: dict
    token: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    language: str
    created_at: str

class OTPRequest(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class OTPVerify(BaseModel):
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    otp: str

# In-memory OTP storage (in production, use Redis or database)
otp_storage = {}

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        payload = verify_token(credentials.credentials)
        if payload is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/request-otp")
async def request_otp(otp_request: OTPRequest, background_tasks: BackgroundTasks):
    """Request OTP for phone/email verification"""
    if not otp_request.phone and not otp_request.email:
        raise HTTPException(status_code=400, detail="Phone or email is required")
    
    # Generate OTP
    otp = generate_otp()
    
    # Store OTP temporarily (in production, use Redis with expiration)
    if otp_request.phone:
        otp_storage[otp_request.phone] = otp
    elif otp_request.email:
        otp_storage[otp_request.email] = otp
    
    # In production, send OTP via SMS or email
    # background_tasks.add_task(send_sms_otp, otp_request.phone, otp)
    # background_tasks.add_task(send_email_otp, otp_request.email, otp)
    
    print(f"OTP for {otp_request.phone or otp_request.email}: {otp}")  # For testing
    
    return {"message": "OTP sent successfully", "otp": otp}  # Remove otp in production

@router.post("/verify-otp")
async def verify_otp_endpoint(otp_verify: OTPVerify):
    """Verify OTP for phone/email"""
    if not otp_verify.phone and not otp_verify.email:
        raise HTTPException(status_code=400, detail="Phone or email is required")
    
    # Get stored OTP
    key = otp_verify.phone or otp_verify.email
    stored_otp = otp_storage.get(key)
    
    if not stored_otp:
        raise HTTPException(status_code=400, detail="OTP not found or expired")
    
    if not verify_otp(otp_verify.otp, stored_otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Remove OTP after successful verification
    del otp_storage[key]
    
    return {"message": "OTP verified successfully"}

@router.post("/register", response_model=LoginResponse)
async def register(user_data: UserSignup):
    """Register a new user with phone/email authentication"""
    conn = await get_database()
    try:
        # Check if user already exists
        if user_data.phone:
            existing_user = await conn.fetchrow(
                "SELECT id FROM core.user WHERE phone = $1 AND deleted_at IS NULL", user_data.phone
            )
        elif user_data.email:
            existing_user = await conn.fetchrow(
                "SELECT id FROM core.user WHERE email = $1 AND deleted_at IS NULL", user_data.email
            )
        else:
            raise HTTPException(status_code=400, detail="Phone or email is required")
        
        if existing_user:
            raise HTTPException(status_code=400, detail="User already registered")
        
        # Hash password
        password_hash = hash_password(user_data.password)
        
        # Insert new user
        user_id = await conn.fetchval('''
            INSERT INTO core.user (phone, email, password_hash, display_name, locale)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        ''', user_data.phone, user_data.email, password_hash, user_data.name, user_data.language)
        
        # Get the created user
        user = await conn.fetchrow('''
            SELECT id, display_name, email, phone, locale, created_at
            FROM core.user WHERE id = $1
        ''', user_id)
        
        # Create token
        token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
        
        user_response = UserResponse(
            id=str(user["id"]),
            name=user["display_name"],
            email=user["email"],
            phone=user["phone"],
            language=user["locale"],
            created_at=user["created_at"].isoformat()
        )
        
        return LoginResponse(
            message="Registration successful",
            user=user_response.dict(),
            token=token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")
    finally:
        await conn.close()

@router.post("/login", response_model=LoginResponse)
async def login(login_data: UserLogin):
    """Login user with phone/email and password"""
    conn = await get_database()
    try:
        # Get user from database
        if login_data.phone:
            user = await conn.fetchrow('''
                SELECT id, display_name, email, phone, password_hash, locale, created_at
                FROM core.user WHERE phone = $1 AND deleted_at IS NULL
            ''', login_data.phone)
        elif login_data.email:
            user = await conn.fetchrow('''
                SELECT id, display_name, email, phone, password_hash, locale, created_at
                FROM core.user WHERE email = $1 AND deleted_at IS NULL
            ''', login_data.email)
        else:
            raise HTTPException(status_code=400, detail="Phone or email is required")
        
        if not user or not verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
        
        user_response = UserResponse(
            id=str(user["id"]),
            name=user["display_name"],
            email=user["email"],
            phone=user["phone"],
            language=user["locale"],
            created_at=user["created_at"].isoformat()
        )
        
        return LoginResponse(
            message="Login successful",
            user=user_response.dict(),
            token=token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
    finally:
        await conn.close()

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Logout successful"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    """Get current user information"""
    conn = await get_database()
    try:
        user = await conn.fetchrow('''
            SELECT id, display_name, email, phone, locale, created_at
            FROM core.user WHERE id = $1 AND deleted_at IS NULL
        ''', current_user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=str(user["id"]),
            name=user["display_name"],
            email=user["email"],
            phone=user["phone"],
            language=user["locale"],
            created_at=user["created_at"].isoformat()
        )
    finally:
        await conn.close()
