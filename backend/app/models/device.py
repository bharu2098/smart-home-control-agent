from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import relationship

from app.database.session import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    device_type = Column(
        String,
        nullable=False,
    )

    room = Column(
        String,
        nullable=False,
    )

    status = Column(
        Boolean,
        default=False,
    )

    value = Column(
        String,
        nullable=True,
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    owner = relationship(
        "User",
        backref="devices",
    )