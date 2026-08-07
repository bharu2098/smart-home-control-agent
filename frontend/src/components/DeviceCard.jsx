import {

    FaLightbulb,

    FaFan,

    FaSnowflake,

    FaTv,

    FaPlug,

    FaQuestion,

    FaEdit,

    FaTrash,

} from "react-icons/fa";

function DeviceCard({

    device,

    onToggle,

    onEdit,

    onDelete,

}) {

    function getIcon() {

        switch (

            device.device_type.toLowerCase()

        ) {

            case "light":

                return <FaLightbulb />;

            case "fan":

                return <FaFan />;

            case "ac":

                return <FaSnowflake />;

            case "tv":

                return <FaTv />;

            case "plug":

                return <FaPlug />;

            default:

                return <FaQuestion />;

        }

    }

    return (

        <div className="device-card">

            <div className="device-icon">

                {getIcon()}

            </div>

            <h2>

                {device.name}

            </h2>

            <p>

                <strong>

                    Type :

                </strong>

                {" "}

                {device.device_type}

            </p>

            <p>

                <strong>

                    Room :

                </strong>

                {" "}

                {device.room}

            </p>

            <span

                className={

                    device.status

                        ? "status on"

                        : "status off"

                }

            >

                {

                    device.status

                        ? "ON"

                        : "OFF"

                }

            </span>

            <button

                className="toggle-btn"

                onClick={() =>

                    onToggle(device.id)

                }

            >

                {

                    device.status

                        ? "Turn OFF"

                        : "Turn ON"

                }

            </button>

            <button

                className="edit-btn"

                onClick={() =>

                    onEdit(device)

                }

            >

                <FaEdit />

                Edit Device

            </button>

            <button

                className="delete-btn"

                onClick={() =>

                    onDelete(device)

                }

            >

                <FaTrash />

                Delete Device

            </button>

        </div>

    );

}

export default DeviceCard;