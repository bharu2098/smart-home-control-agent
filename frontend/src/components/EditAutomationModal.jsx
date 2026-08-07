import { useState } from "react";

function EditAutomationModal({

    automation,

    onClose,

    onUpdate,

}) {

    const [name, setName] =
        useState(automation.name);

    const [

        condition,

        setCondition,

    ] = useState(automation.condition);

    const [

        action,

        setAction,

    ] = useState(automation.action);

    const [

        schedule,

        setSchedule,

    ] = useState(automation.schedule);

    function handleSubmit(e) {

        e.preventDefault();

        onUpdate(

            automation.id,

            {

                name,

                condition,

                action,

                schedule,

            }

        );

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    Edit Automation

                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

                    <input
                        type="text"
                        value={condition}
                        onChange={(e) =>
                            setCondition(e.target.value)
                        }
                        required
                    />

                    <input
                        type="text"
                        value={action}
                        onChange={(e) =>
                            setAction(e.target.value)
                        }
                        required
                    />

                    <input
                        type="text"
                        value={schedule}
                        onChange={(e) =>
                            setSchedule(e.target.value)
                        }
                        required
                    />

                    <div className="modal-buttons">

                        <button

                            type="button"

                            className="cancel-btn"

                            onClick={onClose}

                        >

                            Cancel

                        </button>

                        <button type="submit">

                            Save Changes

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditAutomationModal;