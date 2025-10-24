from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
import asyncpg
import json

from database.config import get_database
from api.auth import get_current_user

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

# Pydantic models
class MessageCreate(BaseModel):
    content: str
    plot_id: Optional[str] = None
    metadata: Optional[Dict] = {}

class ConversationCreate(BaseModel):
    context: Optional[Dict] = {}

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    metadata: Dict
    createdAt: str

class ConversationResponse(BaseModel):
    id: str
    startedAt: str
    context: Dict
    messages: List[MessageResponse]

@router.get("/conversations")
async def get_conversations(current_user_id: str = Depends(get_current_user)):
    """Get all conversations for the current user"""
    conn = await get_database()
    try:
        conversations = await conn.fetch('''
            SELECT id, started_at, context, created_at
            FROM core.conversation 
            WHERE user_id = $1 AND deleted_at IS NULL
            ORDER BY started_at DESC
        ''', current_user_id)
        
        return [
            {
                "id": str(conversation["id"]),
                "startedAt": conversation["started_at"].isoformat(),
                "context": conversation["context"] or {},
                "createdAt": conversation["created_at"].isoformat()
            }
            for conversation in conversations
        ]
    finally:
        await conn.close()

@router.post("/conversations")
async def create_conversation(conversation: ConversationCreate, current_user_id: str = Depends(get_current_user)):
    """Create a new conversation"""
    conn = await get_database()
    try:
        conversation_id = await conn.fetchval('''
            INSERT INTO core.conversation (user_id, context)
            VALUES ($1, $2)
            RETURNING id
        ''', current_user_id, conversation.context or {})
        
        return {"id": str(conversation_id), "message": "Conversation created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create conversation: {str(e)}")
    finally:
        await conn.close()

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, current_user_id: str = Depends(get_current_user)):
    """Get a specific conversation with all messages"""
    conn = await get_database()
    try:
        # Check if conversation belongs to user
        conversation = await conn.fetchrow('''
            SELECT id, started_at, context
            FROM core.conversation 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', conversation_id, current_user_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get all messages for this conversation
        messages = await conn.fetch('''
            SELECT id, role, content, metadata, created_at
            FROM core.message 
            WHERE conversation_id = $1
            ORDER BY created_at ASC
        ''', conversation_id)
        
        return {
            "id": str(conversation["id"]),
            "startedAt": conversation["started_at"].isoformat(),
            "context": conversation["context"] or {},
            "messages": [
                {
                    "id": str(message["id"]),
                    "role": message["role"],
                    "content": message["content"],
                    "metadata": message["metadata"] or {},
                    "createdAt": message["created_at"].isoformat()
                }
                for message in messages
            ]
        }
    finally:
        await conn.close()

@router.post("/conversations/{conversation_id}/messages")
async def create_message(conversation_id: str, message: MessageCreate, current_user_id: str = Depends(get_current_user)):
    """Add a message to a conversation and get AI response"""
    conn = await get_database()
    try:
        # Check if conversation belongs to user
        conversation = await conn.fetchrow('''
            SELECT id FROM core.conversation 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', conversation_id, current_user_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Add user message
        user_message_id = await conn.fetchval('''
            INSERT INTO core.message (conversation_id, role, content, metadata)
            VALUES ($1, 'user', $2, $3)
            RETURNING id
        ''', conversation_id, message.content, message.metadata or {})
        
        # Get conversation context for AI response
        context = await conn.fetchrow('''
            SELECT context FROM core.conversation WHERE id = $1
        ''', conversation_id)
        
        # Generate AI response (simplified - in real implementation, integrate with AI service)
        ai_response = await generate_ai_response(
            message.content, 
            context["context"] if context else {},
            message.plot_id,
            current_user_id
        )
        
        # Add AI response
        ai_message_id = await conn.fetchval('''
            INSERT INTO core.message (conversation_id, role, content, metadata)
            VALUES ($1, 'assistant', $2, $3)
            RETURNING id
        ''', conversation_id, ai_response["content"], ai_response["metadata"])
        
        return {
            "userMessage": {
                "id": str(user_message_id),
                "role": "user",
                "content": message.content,
                "metadata": message.metadata or {},
                "createdAt": datetime.now().isoformat()
            },
            "assistantMessage": {
                "id": str(ai_message_id),
                "role": "assistant",
                "content": ai_response["content"],
                "metadata": ai_response["metadata"],
                "createdAt": datetime.now().isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create message: {str(e)}")
    finally:
        await conn.close()

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, current_user_id: str = Depends(get_current_user)):
    """Delete a conversation (soft delete)"""
    conn = await get_database()
    try:
        result = await conn.execute('''
            UPDATE core.conversation SET deleted_at = CURRENT_TIMESTAMP 
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        ''', conversation_id, current_user_id)
        
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete conversation: {str(e)}")
    finally:
        await conn.close()

@router.get("/assistant/suggestions")
async def get_suggested_questions(current_user_id: str = Depends(get_current_user)):
    """Get suggested questions for the assistant"""
    return {
        "suggestions": [
            {
                "id": "1",
                "question": "Tôi nên làm gì khi lúa bị vàng lá?",
                "category": "pest_disease"
            },
            {
                "id": "2", 
                "question": "Khi nào nên bón phân cho lúa?",
                "category": "fertilizer"
            },
            {
                "id": "3",
                "question": "Làm thế nào để kiểm soát mực nước trong ruộng?",
                "category": "irrigation"
            },
            {
                "id": "4",
                "question": "Giống lúa nào phù hợp với vùng đất phù sa?",
                "category": "variety_selection"
            },
            {
                "id": "5",
                "question": "Cách phòng trừ sâu cuốn lá hiệu quả?",
                "category": "pest_control"
            }
        ]
    }

async def generate_ai_response(user_message: str, context: Dict, plot_id: Optional[str], user_id: str) -> Dict:
    """Generate AI response based on user message and context"""
    # This is a simplified implementation
    # In a real application, you would integrate with an AI service like OpenAI, Claude, etc.
    
    # Get plot information if available
    plot_info = {}
    if plot_id:
        conn = await get_database()
        try:
            plot = await conn.fetchrow('''
                SELECT p.name, p.variety, p.soil_type, f.name as farm_name
                FROM core.plot p
                JOIN core.farm f ON p.farm_id = f.id
                WHERE p.id = $1 AND f.user_id = $2 AND p.deleted_at IS NULL AND f.deleted_at IS NULL
            ''', plot_id, user_id)
            
            if plot:
                plot_info = {
                    "plotName": plot["name"],
                    "variety": plot["variety"],
                    "soilType": plot["soil_type"],
                    "farmName": plot["farm_name"]
                }
        except Exception:
            pass
    
    # Simple response mapping for common questions
    response_mapping = {
        "vàng lá": {
            "content": "Lúa bị vàng lá có thể do nhiều nguyên nhân:\n\n1. **Thiếu dinh dưỡng**: Cần bón phân NPK cân đối\n2. **Ngập úng**: Kiểm tra và điều chỉnh mực nước\n3. **Sâu bệnh**: Quan sát kỹ để xác định loại sâu bệnh cụ thể\n\nBạn có thể chụp ảnh gửi cho tôi để phân tích kỹ hơn.",
            "metadata": {"suggested_actions": ["kiểm tra mực nước", "bón phân", "chụp ảnh"]}
        },
        "bón phân": {
            "content": "Bón phân cho lúa nên chia làm 3 đợt chính:\n\n• **Đợt 1**: 7-10 ngày sau sạ (bón thúc)\n• **Đợt 2**: 18-22 ngày (bón đón đòng)\n• **Đợt 3**: 40-45 ngày (bón nuôi hạt)\n\nLiều lượng tùy thuộc vào giống lúa và điều kiện đất đai.",
            "metadata": {"suggested_actions": ["kiểm tra giai đoạn sinh trưởng", "xác định loại phân"]}
        },
        "mực nước": {
            "content": "Quản lý mực nước cho lúa:\n\n• **Giai đoạn mạ**: Giữ ẩm, không ngập\n• **Giai đoạn đẻ nhánh**: Ngập 3-5cm\n• **Giai đoạn làm đòng**: Ngập 5-7cm\n• **Giai đoạn chín**: Rút nước từ từ\n\nLuôn theo dõi thời tiết để điều chỉnh phù hợp.",
            "metadata": {"suggested_actions": ["kiểm tra giai đoạn", "điều chỉnh mực nước"]}
        },
        "sâu cuốn lá": {
            "content": "Phòng trừ sâu cuốn lá:\n\n• **Biện pháp sinh học**: Bảo vệ thiên địch\n• **Biện pháp hóa học**: Sử dụng thuốc khi mật độ sâu > 20 con/m²\n• **Thời điểm phun**: Sâu tuổi 1-2\n\nNên phun vào sáng sớm hoặc chiều mát.",
            "metadata": {"suggested_actions": ["kiểm tra mật độ sâu", "chuẩn bị thuốc"]}
        }
    }
    
    # Find matching response
    user_message_lower = user_message.lower()
    for keyword, response in response_mapping.items():
        if keyword in user_message_lower:
            return response
    
    # Default response
    return {
        "content": "Cảm ơn câu hỏi của bạn! Tôi là trợ lý nông nghiệp AIRRVie, có thể giúp bạn với:\n\n• Kỹ thuật trồng lúa\n• Quản lý sâu bệnh\n• Bón phân và tưới tiêu\n• Chọn giống phù hợp\n\nHãy mô tả cụ thể vấn đề bạn đang gặp phải.",
        "metadata": {"suggested_actions": ["mô tả vấn đề", "chụp ảnh", "cung cấp thông tin plot"]}
    }

@router.get("/assistant/knowledge")
async def get_knowledge_base(search: str = "", lang: str = "vi"):
    """Get knowledge base content for RAG"""
    conn = await get_database()
    try:
        if search:
            # Search in knowledge base
            chunks = await conn.fetch('''
                SELECT id, source, title, content, lang, tags
                FROM core.knowledge_chunk 
                WHERE (lang = $1 OR lang = 'both') AND deleted_at IS NULL
                AND (to_tsvector('simple', content) @@ plainto_tsquery('simple', $2)
                     OR to_tsvector('simple', title) @@ plainto_tsquery('simple', $2))
                ORDER BY ts_rank(to_tsvector('simple', content), plainto_tsquery('simple', $2)) DESC
                LIMIT 10
            ''', lang, search)
        else:
            # Get recent knowledge chunks
            chunks = await conn.fetch('''
                SELECT id, source, title, content, lang, tags
                FROM core.knowledge_chunk 
                WHERE (lang = $1 OR lang = 'both') AND deleted_at IS NULL
                ORDER BY created_at DESC
                LIMIT 10
            ''', lang)
        
        return [
            {
                "id": str(chunk["id"]),
                "source": chunk["source"],
                "title": chunk["title"],
                "content": chunk["content"],
                "lang": chunk["lang"],
                "tags": chunk["tags"] or []
            }
            for chunk in chunks
        ]
    finally:
        await conn.close()
