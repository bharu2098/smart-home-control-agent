import { useState } from "react";

function AddDeviceModal({

    onClose,

    onAdd,

}) {

    const [name, setName] =
        useState("");

    const [deviceType, setDeviceType] =
        useState("Light");

    const [room, setRoom] =
        useState("");

    function handleSubmit(e) {

        e.preventDefault();

        onAdd({

            name,

            device_type: deviceType,

            room,

        });

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    Add New Device

                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Device Name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        required
                    />

                    <select
                        value={deviceType}
                        onChange={(e) =>
                            setDeviceType(
                                e.target.value
                            )
                        }
                    >

                        <option>

                            Light

                        </option>

                        <option>

                            Fan

                        </option>

                        <option>

                            AC

                        </option>

                        <option>

                            TV

                        </option>

                        <option>

                            Plug

                        </option>

                    </select>

                    <input
                        type="text"
                        placeholder="Room"
                        value={room}
                        onChange={(e) =>
                            setRoom(
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

                            Add Device

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddDeviceModal;