from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.dependencies import get_current_user

from app.models.user import User
from app.models.automation import Automation

from app.schemas.automation import (
    AutomationCreate,
    AutomationUpdate,
    AutomationResponse,
)


router = APIRouter(
    prefix="/automations",
    tags=["Automations"],
)


# =====================================================
# Create Automation
# =====================================================

@router.post(
    "/",
    response_model=AutomationResponse,
)
def create_automation(
    automation: AutomationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    new_automation = Automation(
        name=automation.name,
        condition=automation.condition,
        action=automation.action,
        schedule=automation.schedule,
        owner_id=current_user.id,
    )

    db.add(new_automation)
    db.commit()
    db.refresh(new_automation)

    return new_automation


# =====================================================
# Get All Automations
# =====================================================

@router.get(
    "/",
    response_model=list[AutomationResponse],
)
def get_automations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    automations = (
        db.query(Automation)
        .filter(
            Automation.owner_id == current_user.id,
        )
        .all()
    )

    return automations


# =====================================================
# Update Automation
# =====================================================

@router.put(
    "/{automation_id}",
    response_model=AutomationResponse,
)
def update_automation(
    automation_id: int,
    automation_data: AutomationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    automation = (
        db.query(Automation)
        .filter(
            Automation.id == automation_id,
            Automation.owner_id == current_user.id,
        )
        .first()
    )

    if not automation:
        raise HTTPException(
            status_code=404,
            detail="Automation not found.",
        )

    update_data = automation_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(automation, key, value)

    db.commit()
    db.refresh(automation)

    return automation


# =====================================================
# Delete Automation
# =====================================================

@router.delete(
    "/{automation_id}",
)
def delete_automation(
    automation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    automation = (
        db.query(Automation)
        .filter(
            Automation.id == automation_id,
            Automation.owner_id == current_user.id,
        )
        .first()
    )

    if not automation:
        raise HTTPException(
            status_code=404,
            detail="Automation not found.",
        )

    db.delete(automation)
    db.commit()

    return {
        "message": "Automation deleted successfully."
    }


# =====================================================
# Toggle Automation
# =====================================================

@router.post(
    "/{automation_id}/toggle",
    response_model=AutomationResponse,
)
def toggle_automation(
    automation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    automation = (
        db.query(Automation)
        .filter(
            Automation.id == automation_id,
            Automation.owner_id == current_user.id,
        )
        .first()
    )

    if not automation:
        raise HTTPException(
            status_code=404,
            detail="Automation not found.",
        )

    automation.is_enabled = not automation.is_enabled

    db.commit()
    db.refresh(automation)

    return automation