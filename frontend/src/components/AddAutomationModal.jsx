import { useState } from "react";

function AddAutomationModal({

    onClose,

    onAdd,

}) {

    const [name, setName] =
        useState("");

    const [

        condition,

        setCondition,

    ] = useState("");

    const [

        action,

        setAction,

    ] = useState("");

    const [

        schedule,

        setSchedule,

    ] = useState("");

    function handleSubmit(e) {

        e.preventDefault();

        onAdd({

            name,

            condition,

            action,

            schedule,

        });

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    Add New Automation

                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Automation Name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Condition"
                        value={condition}
                        onChange={(e) =>
                            setCondition(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Action"
                        value={action}
                        onChange={(e) =>
                            setAction(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Schedule"
                        value={schedule}
                        onChange={(e) =>
                            setSchedule(
                                e.target.value
                            )
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

                        <button
                            type="submit"
                        >

                            Add Automation

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddAutomationModal;