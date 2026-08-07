import {
    FaClock,
    FaBolt,
    FaCalendarAlt,
    FaToggleOn,
    FaToggleOff,
    FaEdit,
    FaTrash,
} from "react-icons/fa";

function AutomationCard({

    automation,

    onToggle,

    onEdit,

    onDelete,

}) {

    return (

        <div className="automation-card">

            <div className="automation-icon">

                <FaBolt />

            </div>

            <h2>

                {automation.name}

            </h2>

            <p>

                <strong>

                    <FaClock />

                    {" "}Condition :

                </strong>

                {" "}

                {automation.condition}

            </p>

            <p>

                <strong>

                    <FaBolt />

                    {" "}Action :

                </strong>

                {" "}

                {automation.action}

            </p>

            <p>

                <strong>

                    <FaCalendarAlt />

                    {" "}Schedule :

                </strong>

                {" "}

                {automation.schedule}

            </p>

            <div className="automation-status">

                <span

                    className={

                        automation.is_enabled

                            ? "status on"

                            : "status off"

                    }

                >

                    {

                        automation.is_enabled

                            ? "Enabled"

                            : "Disabled"

                    }

                </span>

            </div>

            <div className="automation-actions">

                <button

                    className="toggle-btn"

                    onClick={() =>

                        onToggle(automation.id)

                    }

                >

                    {

                        automation.is_enabled

                            ? (

                                <>

                                    <FaToggleOff />

                                    {" "}Disable

                                </>

                            )

                            : (

                                <>

                                    <FaToggleOn />

                                    {" "}Enable

                                </>

                            )

                    }

                </button>

                <button

                    className="edit-btn"

                    onClick={() =>

                        onEdit(automation)

                    }

                >

                    <FaEdit />

                    Edit Automation

                </button>

                <button

                    className="delete-btn"

                    onClick={() =>

                        onDelete(automation)

                    }

                >

                    <FaTrash />

                    Delete Automation

                </button>

            </div>

        </div>

    );

}

export default AutomationCard;