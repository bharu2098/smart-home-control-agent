from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.core.dependencies import get_current_user

from app.models.user import User
from app.models.device import Device
from app.models.automation import Automation

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from app.services.ai_service import ask_ai


router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"],
)


@router.post(
    "/",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    ai_response = ask_ai(request.message)

    # -------------------------------------------------
    # Turn ON All Devices
    # -------------------------------------------------

    if "ACTION:TURN_ON_ALL" in ai_response:

        device_type = (
            ai_response.split("TYPE:")[1]
            .strip()
        )

        devices = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.device_type.ilike(device_type),
            )
            .all()
        )

        if not devices:

            return {
                "response": f"No {device_type} devices found.",
                "action": "TURN_ON_ALL",
            }

        for device in devices:
            device.status = True

        db.commit()

        return {
            "response": f"{len(devices)} {device_type}(s) turned ON.",
            "action": "TURN_ON_ALL",
        }

    # -------------------------------------------------
    # Turn OFF All Devices
    # -------------------------------------------------

    if "ACTION:TURN_OFF_ALL" in ai_response:

        device_type = (
            ai_response.split("TYPE:")[1]
            .strip()
        )

        devices = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.device_type.ilike(device_type),
            )
            .all()
        )

        if not devices:

            return {
                "response": f"No {device_type} devices found.",
                "action": "TURN_OFF_ALL",
            }

        for device in devices:
            device.status = False

        db.commit()

        return {
            "response": f"{len(devices)} {device_type}(s) turned OFF.",
            "action": "TURN_OFF_ALL",
        }

    # -------------------------------------------------
    # Turn ON Single Device
    # -------------------------------------------------

    if "ACTION:TURN_ON" in ai_response:

        device_name = (
            ai_response.split("DEVICE:")[1]
            .strip()
        )

        device = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.name.ilike(device_name),
            )
            .first()
        )

        if not device:

            return {
                "response": "Device not found.",
                "action": "TURN_ON",
            }

        device.status = True

        db.commit()
        db.refresh(device)

        return {
            "response": f"{device.name} has been turned ON.",
            "action": "TURN_ON",
        }

    # -------------------------------------------------
    # Turn OFF Single Device
    # -------------------------------------------------

    if "ACTION:TURN_OFF" in ai_response:

        device_name = (
            ai_response.split("DEVICE:")[1]
            .strip()
        )

        device = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.name.ilike(device_name),
            )
            .first()
        )

        if not device:

            return {
                "response": "Device not found.",
                "action": "TURN_OFF",
            }

        device.status = False

        db.commit()
        db.refresh(device)

        return {
            "response": f"{device.name} has been turned OFF.",
            "action": "TURN_OFF",
        }
        # -------------------------------------------------
    # List All Devices
    # -------------------------------------------------

    if "ACTION:LIST_DEVICES" in ai_response:

        devices = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id
            )
            .all()
        )

        if not devices:

            return {
                "response": "You don't have any devices.",
                "action": "LIST_DEVICES",
            }

        message = "# 🏠 Your Devices\n\n"

        for device in devices:

            status = "🟢 ON" if device.status else "🔴 OFF"

            value = device.value if device.value else "-"

            message += (
                f"## {device.name}\n"
                f"- **Type:** {device.device_type}\n"
                f"- **Room:** {device.room}\n"
                f"- **Status:** {status}\n"
                f"- **Value:** {value}\n\n"
            )
        return {
            "response": message,
            "action": "LIST_DEVICES",
        }

    # -------------------------------------------------
    # List ON Devices
    # -------------------------------------------------

    if "ACTION:LIST_ON" in ai_response:

        devices = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.status == True,
            )
            .all()
        )

        if not devices:

            return {
                "response": "No devices are currently ON.",
                "action": "LIST_ON",
            }

        message = "# 🟢 Devices Currently ON\n\n"

        for device in devices:

            message += (
                f"- **{device.name}**\n"
            )

        return {
            "response": message,
            "action": "LIST_ON",
        }

    # -------------------------------------------------
    # List OFF Devices
    # -------------------------------------------------

    if "ACTION:LIST_OFF" in ai_response:

        devices = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.status == False,
            )
            .all()
        )

        if not devices:

            return {
                "response": "No devices are currently OFF.",
                "action": "LIST_OFF",
            }

        message = "# 🔴 Devices Currently OFF\n\n"

        for device in devices:

            message += (
                f"- **{device.name}**\n"
            )
        return {
            "response": message,
            "action": "LIST_OFF",
        }

    # -------------------------------------------------
    # Count Devices
    # -------------------------------------------------

    if "ACTION:COUNT_DEVICES" in ai_response:

        total = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id
            )
            .count()
        )

        return {
            "response": f"You have {total} device(s).",
            "action": "COUNT_DEVICES",
        }

    # -------------------------------------------------
    # Check Device Status
    # -------------------------------------------------

    if "ACTION:CHECK_DEVICE" in ai_response:

        device_name = (
            ai_response.split("DEVICE:")[1]
            .strip()
        )

        device = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.name.ilike(device_name),
            )
            .first()
        )

        if not device:

            return {
                "response": "Device not found.",
                "action": "CHECK_DEVICE",
            }

        status = (
            "ON"
            if device.status
            else "OFF"
        )

        value = (
            device.value
            if device.value
            else "-"
        )

        return {
            "response": (
                f"{device.name} is currently {status}.\n"
                f"Current Value : {value}"
            ),
            "action": "CHECK_DEVICE",
        }
        # -------------------------------------------------
    # Set Light Brightness
    # -------------------------------------------------

    if "ACTION:SET_BRIGHTNESS" in ai_response:

        device_name = (
            ai_response.split("DEVICE:")[1]
            .split("VALUE:")[0]
            .strip()
        )

        value = (
            ai_response.split("VALUE:")[1]
            .strip()
        )

        device = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.name.ilike(device_name),
            )
            .first()
        )

        if not device:

            return {
                "response": "Device not found.",
                "action": "SET_BRIGHTNESS",
            }

        device.value = f"Brightness {value}%"

        db.commit()
        db.refresh(device)

        return {
            "response": f"{device.name} brightness set to {value}%.",
            "action": "SET_BRIGHTNESS",
        }

    # -------------------------------------------------
    # Set Fan Speed
    # -------------------------------------------------

    if "ACTION:SET_FAN_SPEED" in ai_response:

        device_name = (
            ai_response.split("DEVICE:")[1]
            .split("VALUE:")[0]
            .strip()
        )

        value = (
            ai_response.split("VALUE:")[1]
            .strip()
        )

        device = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.name.ilike(device_name),
            )
            .first()
        )

        if not device:

            return {
                "response": "Device not found.",
                "action": "SET_FAN_SPEED",
            }

        device.value = f"Speed {value}"

        db.commit()
        db.refresh(device)

        return {
            "response": f"{device.name} speed set to {value}.",
            "action": "SET_FAN_SPEED",
        }

    # -------------------------------------------------
    # Set AC Temperature
    # -------------------------------------------------

    if "ACTION:SET_TEMPERATURE" in ai_response:

        device_name = (
            ai_response.split("DEVICE:")[1]
            .split("VALUE:")[0]
            .strip()
        )

        value = (
            ai_response.split("VALUE:")[1]
            .strip()
        )

        device = (
            db.query(Device)
            .filter(
                Device.owner_id == current_user.id,
                Device.name.ilike(device_name),
            )
            .first()
        )

        if not device:

            return {
                "response": "Device not found.",
                "action": "SET_TEMPERATURE",
            }

        device.value = f"{value}°C"

        db.commit()
        db.refresh(device)

        return {
            "response": f"{device.name} temperature set to {value}°C.",
            "action": "SET_TEMPERATURE",
        }

    # -------------------------------------------------
    # Create Automation
    # -------------------------------------------------

    if "ACTION:CREATE_AUTOMATION" in ai_response:

        name = (
            ai_response.split("NAME:")[1]
            .split("CONDITION:")[0]
            .strip()
        )

        condition = (
            ai_response.split("CONDITION:")[1]
            .split("ACTION_TEXT:")[0]
            .strip()
        )

        action_text = (
            ai_response.split("ACTION_TEXT:")[1]
            .split("SCHEDULE:")[0]
            .strip()
        )

        schedule = (
            ai_response.split("SCHEDULE:")[1]
            .strip()
        )

        existing = (
            db.query(Automation)
            .filter(
                Automation.owner_id == current_user.id,
                Automation.name.ilike(name),
            )
            .first()
        )

        if existing:

            return {
                "response": "Automation already exists.",
                "action": "CREATE_AUTOMATION",
            }

        automation = Automation(
            name=name,
            condition=condition,
            action=action_text,
            schedule=schedule,
            is_enabled=True,
            owner_id=current_user.id,
        )

        db.add(automation)

        db.commit()

        db.refresh(automation)

        return {
            "response": f"Automation '{automation.name}' created successfully.",
            "action": "CREATE_AUTOMATION",
        }

    # -------------------------------------------------
    # List Automations
    # -------------------------------------------------

    if "ACTION:LIST_AUTOMATIONS" in ai_response:

        automations = (
            db.query(Automation)
            .filter(
                Automation.owner_id == current_user.id
            )
            .all()
        )

        if not automations:

            return {
                "response": "You don't have any automations.",
                "action": "LIST_AUTOMATIONS",
            }

        message = "# ⚡ Your Automations\n\n"

        for automation in automations:

            status = (
                "🟢 Enabled"
                if automation.is_enabled
                else "🔴 Disabled"
            )

            message += (
                f"## {automation.name}\n"
                f"- **Time:** {automation.condition}\n"
                f"- **Action:** {automation.action}\n"
                f"- **Schedule:** {automation.schedule}\n"
                f"- **Status:** {status}\n\n"
            )
        return {
            "response": message,
            "action": "LIST_AUTOMATIONS",
        }

    # -------------------------------------------------
    # Delete Automation
    # -------------------------------------------------

    if "ACTION:DELETE_AUTOMATION" in ai_response:

        automation_name = (
            ai_response.split("NAME:")[1]
            .strip()
        )

        automation = (
            db.query(Automation)
            .filter(
                Automation.owner_id == current_user.id,
                Automation.name.ilike(automation_name),
            )
            .first()
        )

        if not automation:

            return {
                "response": "Automation not found.",
                "action": "DELETE_AUTOMATION",
            }

        db.delete(automation)

        db.commit()

        return {
            "response": f"Automation '{automation.name}' deleted successfully.",
            "action": "DELETE_AUTOMATION",
        }
        # -------------------------------------------------
    # Enable Automation
    # -------------------------------------------------

    if "ACTION:ENABLE_AUTOMATION" in ai_response:

        automation_name = (
            ai_response.split("NAME:")[1]
            .strip()
        )

        automation = (
            db.query(Automation)
            .filter(
                Automation.owner_id == current_user.id,
                Automation.name.ilike(automation_name),
            )
            .first()
        )

        if not automation:

            return {
                "response": "Automation not found.",
                "action": "ENABLE_AUTOMATION",
            }

        automation.is_enabled = True

        db.commit()
        db.refresh(automation)

        return {
            "response": f"Automation '{automation.name}' enabled successfully.",
            "action": "ENABLE_AUTOMATION",
        }
        # -------------------------------------------------
    # Disable Automation
    # -------------------------------------------------

    if "ACTION:DISABLE_AUTOMATION" in ai_response:

        automation_name = (
            ai_response.split("NAME:")[1]
            .strip()
        )

        automation = (
            db.query(Automation)
            .filter(
                Automation.owner_id == current_user.id,
                Automation.name.ilike(automation_name),
            )
            .first()
        )

        if not automation:

            return {
                "response": "Automation not found.",
                "action": "DISABLE_AUTOMATION",
            }

        automation.is_enabled = False

        db.commit()
        db.refresh(automation)

        return {
            "response": f"Automation '{automation.name}' disabled successfully.",
            "action": "DISABLE_AUTOMATION",
        }
    # -------------------------------------------------
    # Update Automation
    # -------------------------------------------------

    if "ACTION:UPDATE_AUTOMATION" in ai_response:

        automation_name = (
            ai_response.split("NAME:")[1]
            .split("CONDITION:")[0]
            .strip()
       )

        new_condition = (
            ai_response.split("CONDITION:")[1]
            .strip()
       )

        automation = (
            db.query(Automation)
            .filter(
                Automation.owner_id == current_user.id,
                Automation.name.ilike(automation_name),
           )
           .first()
        )

        if not automation:

           return {
               "response": "Automation not found.",
               "action": "UPDATE_AUTOMATION",
           }

        automation.condition = new_condition

        db.commit()
        db.refresh(automation)

        return {
            "response": f"Automation '{automation.name}' updated successfully.",
            "action": "UPDATE_AUTOMATION",
       }
    # -------------------------------------------------
    # Out Of Scope
    # -------------------------------------------------

    if "ACTION:OUT_OF_SCOPE" in ai_response:

        message = (
            ai_response.split("MESSAGE:")[1]
            .strip()
        )

        return {
            "response": message,
            "action": "OUT_OF_SCOPE",
        }

    # -------------------------------------------------
    # Normal Chat
    # -------------------------------------------------

    return {
        "response": ai_response,
        "action": None,
    }