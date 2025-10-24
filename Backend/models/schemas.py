from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID

# Authentication models
class UserSignup(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: str
    language: str = "vi"
    font_scale: str = "medium"

class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    password: str

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: Optional[str]
    phone: Optional[str]
    language: str
    font_scale: str
    created_at: datetime

class LoginResponse(BaseModel):
    message: str
    user: UserResponse
    token: str

# Farm models
class FarmCreate(BaseModel):
    name: str
    province: str
    district: str
    address_text: Optional[str] = None

class FarmResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    province: str
    district: str
    address_text: Optional[str]
    created_at: datetime
    updated_at: datetime

# Plot models
class PlotCreate(BaseModel):
    farm_id: UUID
    name: str
    area_m2: float
    soil_type: Optional[str] = None
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    harvest_date: Optional[date] = None
    irrigation_method: Optional[str] = None
    notes: Optional[str] = None
    photos: List[str] = []

class PlotResponse(BaseModel):
    id: UUID
    farm_id: UUID
    name: str
    area_m2: float
    soil_type: Optional[str]
    variety: Optional[str]
    planting_date: Optional[date]
    harvest_date: Optional[date]
    irrigation_method: Optional[str]
    notes: Optional[str]
    photos: List[str]
    created_at: datetime
    updated_at: datetime

# Task models
class TaskCreate(BaseModel):
    plot_id: UUID
    title: str
    description: Optional[str] = None
    due_date: date
    priority: str = "medium"  # low, medium, high
    status: str = "pending"  # pending, in_progress, done
    type: str  # planting, weeding, fertilizer, irrigation, pest, harvest, other
    source: str = "manual"  # manual, calendar, system
    reminder: bool = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    reminder: Optional[bool] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: UUID
    plot_id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    due_date: date
    priority: str
    status: str
    type: str
    source: str
    reminder: bool
    completed: bool
    created_at: datetime
    updated_at: datetime

# Journal models
class JournalEntryCreate(BaseModel):
    plot_id: UUID
    entry_date: date
    type: str  # planting, fertilizer, irrigation, pest, harvest, other
    title: str
    content: Optional[str] = None
    photos: List[str] = []
    audio_url: Optional[str] = None

class JournalEntryResponse(BaseModel):
    id: UUID
    plot_id: UUID
    user_id: UUID
    entry_date: date
    type: str
    title: str
    content: Optional[str]
    photos: List[str]
    audio_url: Optional[str]
    created_at: datetime
    updated_at: datetime

# Weather models
class WeatherData(BaseModel):
    plot_id: UUID
    for_date: date
    max_temp: Optional[float] = None
    min_temp: Optional[float] = None
    precipitation_mm: Optional[float] = None
    wind_kph: Optional[float] = None
    payload: Dict[str, Any]

class WeatherResponse(BaseModel):
    id: int
    plot_id: UUID
    for_date: date
    max_temp: Optional[float]
    min_temp: Optional[float]
    precipitation_mm: Optional[float]
    wind_kph: Optional[float]
    payload: Dict[str, Any]
    fetched_at: datetime
    created_at: datetime

# Conversation models
class ConversationCreate(BaseModel):
    context: Optional[Dict[str, Any]] = None

class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    started_at: datetime
    context: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

# Message models
class MessageCreate(BaseModel):
    conversation_id: UUID
    role: str  # user, assistant, system
    content: str
    metadata: Optional[Dict[str, Any]] = None

class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    metadata: Dict[str, Any]
    created_at: datetime

# Knowledge chunk models
class KnowledgeChunkCreate(BaseModel):
    source: str
    title: str
    content: str
    lang: str = "vi"  # en, vi
    tags: List[str] = []

class KnowledgeChunkResponse(BaseModel):
    id: UUID
    source: str
    title: str
    content: str
    lang: str
    tags: List[str]
    embedding: Optional[List[float]] = None
    created_at: datetime
    updated_at: datetime

# Media asset models
class MediaAssetCreate(BaseModel):
    kind: str  # photo, audio, other
    storage_provider: str = "s3"
    bucket: Optional[str] = None
    key: str
    url: Optional[str] = None
    bytes: Optional[int] = None
    sha256: Optional[str] = None

class MediaAssetResponse(BaseModel):
    id: UUID
    user_id: UUID
    kind: str
    storage_provider: str
    bucket: Optional[str]
    key: str
    url: Optional[str]
    bytes: Optional[int]
    sha256: Optional[str]
    created_at: datetime
    updated_at: datetime

# Job queue models
class JobCreate(BaseModel):
    job_type: str
    payload: Dict[str, Any]

class JobResponse(BaseModel):
    id: int
    job_type: str
    payload: Dict[str, Any]
    status: str  # queued, running, done, failed
    attempts: int
    error: Optional[str]
    created_at: datetime
    started_at: Optional[datetime]
    finished_at: Optional[datetime]

# API Response models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int

# Search models
class SearchRequest(BaseModel):
    query: str
    lang: str = "vi"
    limit: int = 10

class SearchResponse(BaseModel):
    results: List[KnowledgeChunkResponse]
    total: int

# Weather forecast models
class WeatherForecastRequest(BaseModel):
    plot_id: UUID
    days: int = 7

class WeatherForecastResponse(BaseModel):
    plot_id: UUID
    forecasts: List[WeatherResponse]
    last_updated: datetime
