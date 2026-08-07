from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.device import Device
from app.models.user import User

from app.schemas.device import (
    DeviceCreate,
    DeviceUpdate,
    DeviceResponse,
)

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/devices",
    tags=["Devices"],
)


# =====================================================
# Add Device
# =====================================================

@router.post(
    "/",
    response_model=DeviceResponse,
)
def add_device(
    device: DeviceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    new_device = Device(
        name=device.name,
        device_type=device.device_type,
        room=device.room,
        status=False,
        value=None,
        owner_id=current_user.id,
    )

    db.add(new_device)
    db.commit()
    db.refresh(new_device)

    return new_device


# =====================================================
# Get All Devices
# =====================================================

@router.get(
    "/",
    response_model=list[DeviceResponse],
)
def get_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return (
        db.query(Device)
        .filter(Device.owner_id == current_user.id)
        .all()
    )


# =====================================================
# Get Device By ID
# =====================================================

@router.get(
    "/{device_id}",
    response_model=DeviceResponse,
)
def get_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    device = (
        db.query(Device)
        .filter(
            Device.id == device_id,
            Device.owner_id == current_user.id,
        )
        .first()
    )

    if device is None:
        raise HTTPException(
            status_code=404,
            detail="Device not found.",
        )

    return device


# =====================================================
# Update Device
# =====================================================

@router.put(
    "/{device_id}",
    response_model=DeviceResponse,
)
def update_device(
    device_id: int,
    updated_device: DeviceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    device = (
        db.query(Device)
        .filter(
            Device.id == device_id,
            Device.owner_id == current_user.id,
        )
        .first()
    )

    if device is None:
        raise HTTPException(
            status_code=404,
            detail="Device not found.",
        )

    update_data = updated_device.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(device, key, value)

    db.commit()
    db.refresh(device)

    return device


# =====================================================
# Delete Device
# =====================================================

@router.delete("/{device_id}")
def delete_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    device = (
        db.query(Device)
        .filter(
            Device.id == device_id,
            Device.owner_id == current_user.id,
        )
        .first()
    )

    if device is None:
        raise HTTPException(
            status_code=404,
            detail="Device not found.",
        )

    db.delete(device)
    db.commit()

    return {
        "message": "Device deleted successfully."
    }


# =====================================================
# Toggle Device
# =====================================================

@router.post("/{device_id}/toggle")
def toggle_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    device = (
        db.query(Device)
        .filter(
            Device.id == device_id,
            Device.owner_id == current_user.id,
        )
        .first()
    )

    if device is None:
        raise HTTPException(
            status_code=404,
            detail="Device not found.",
        )

    device.status = not device.status

    db.commit()
    db.refresh(device)

    return {
        "message": "Device toggled successfully.",
        "device": {
            "id": device.id,
            "name": device.name,
            "status": device.status,
        },
    }