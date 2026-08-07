from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.automation import Automation
from app.models.device import Device


scheduler = BackgroundScheduler()


def execute_automations():

    db: Session = SessionLocal()

    try:

        # ---------------------------------------------
        # Current Time
        # Example: 3:25 PM
        # ---------------------------------------------

        current_time = (
            datetime.now()
            .strftime("%I:%M %p")
            .lstrip("0")
        )

        print(f"[Scheduler] Current Time : {current_time}")

        automations = (
            db.query(Automation)
            .filter(
                Automation.is_enabled == True
            )
            .all()
        )

        for automation in automations:

            print(
                f"[Scheduler] Checking -> "
                f"{automation.name} | "
                f"{automation.condition}"
            )

            # ---------------------------------------------
            # Skip if time doesn't match
            # ---------------------------------------------

            if (
                automation.condition.strip().lower()
                != current_time.lower()
            ):
                continue

            print(
                f"[Scheduler] Executing -> "
                f"{automation.name}"
            )

            action = automation.action.lower()

            # =============================================
            # Turn ON Device
            # =============================================

            if "turn on" in action:

                device_name = (
                    automation.action
                    .replace("Turn ON", "")
                    .strip()
                )

                device = (
                    db.query(Device)
                    .filter(
                        Device.owner_id == automation.owner_id,
                        Device.name.ilike(device_name),
                    )
                    .first()
                )

                if device:

                    device.status = True

                    db.commit()

                    print(
                        f"[Scheduler] {device.name} turned ON"
                    )

            # =============================================
            # Turn OFF Device
            # =============================================

            elif "turn off" in action:

                device_name = (
                    automation.action
                    .replace("Turn OFF", "")
                    .strip()
                )

                device = (
                    db.query(Device)
                    .filter(
                        Device.owner_id == automation.owner_id,
                        Device.name.ilike(device_name),
                    )
                    .first()
                )

                if device:

                    device.status = False

                    db.commit()

                    print(
                        f"[Scheduler] {device.name} turned OFF"
                    )

    except Exception as e:

        print(f"[Scheduler Error] {e}")

    finally:

        db.close()


def start_scheduler():

    if scheduler.running:
        return

    scheduler.add_job(
        execute_automations,
        trigger="interval",
        minutes=1,
        id="automation_runner",
        replace_existing=True,
    )

    scheduler.start()

    print("===================================")
    print("Scheduler Started")
    print("===================================")


def stop_scheduler():

    if scheduler.running:

        scheduler.shutdown()

        print("===================================")
        print("Scheduler Stopped")
        print("===================================")