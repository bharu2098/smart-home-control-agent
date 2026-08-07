from pydantic import BaseModel
from typing import Optional


class AutomationCreate(BaseModel):
    name: str
    condition: str
    action: str
    schedule: Optional[str] = None


class AutomationUpdate(BaseModel):
    name: Optional[str] = None
    condition: Optional[str] = None
    action: Optional[str] = None
    schedule: Optional[str] = None
    is_enabled: Optional[bool] = None


class AutomationResponse(BaseModel):
    id: int
    name: str
    condition: str
    action: str
    schedule: Optional[str]
    is_enabled: bool

    model_config = {
        "from_attributes": True
    }