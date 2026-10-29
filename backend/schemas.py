from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=72)


class UserOut(BaseModel):
    id: int
    username: str
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class ResourceBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    url: str = Field(min_length=1, max_length=500)
    description: Optional[str] = None
    category: Optional[str] = Field(default=None, max_length=50)


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    url: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = None
    category: Optional[str] = Field(default=None, max_length=50)


class ResourceOut(ResourceBase):
    id: int
    created_at: datetime
    owner: UserOut
    model_config = ConfigDict(from_attributes=True)