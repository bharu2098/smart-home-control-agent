from pydantic import BaseModel


class DeviceCreate(BaseModel):
    name: str
    device_type: str
    room: str


class DeviceUpdate(BaseModel):
    name: str | None = None
    device_type: str | None = None
    room: str | None = None
    status: bool | None = None
    value: str | None = None


class DeviceResponse(BaseModel):
    id: int
    name: str
    device_type: str
    room: str
    status: bool
    value: str | None = None
    owner_id: int

    model_config = {
        "from_attributes": True
    }