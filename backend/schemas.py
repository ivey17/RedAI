from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class Comment(BaseModel):
    author: str
    text: str
    likes: int = 0

class Post(BaseModel):
    post_id: str
    album_id: Optional[str] = None
    user_id: str
    title: str
    raw_content: str
    parsed_content: Optional[str] = None
    image_urls: List[str] = []
    comments: List[Comment] = []
    tags: List[str] = []

class WorkingSetAddRequest(BaseModel):
    user_id: str
    post_id: str
    post_content: str
    image_urls: List[str] = []
    comments: List[Comment] = []

class WorkingSetUpdateRequest(BaseModel):
    user_id: str
    album_id: str
    selected_post_ids: List[str]

class WorkingSetRemoveRequest(BaseModel):
    user_id: str
    post_id: str

class WorkingSetClearRequest(BaseModel):
    user_id: str

class AIChatRequest(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    post_ids: List[str]
    question: str
    need_search: bool = False

class AlbumCreateRequest(BaseModel):
    user_id: str
    title: str
    description: Optional[str] = ""
    image_url: Optional[str] = ""

class AlbumAddPostRequest(BaseModel):
    album_id: str
    post_id: str
