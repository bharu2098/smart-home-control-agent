import { useState } from "react";

function EditDeviceModal({

    device,

    onClose,

    onUpdate,

}) {

    const [name, setName] =
        useState(device.name);

    const [

        deviceType,

        setDeviceType,

    ] = useState(device.device_type);

    const [room, setRoom] =
        useState(device.room);

    function handleSubmit(e) {

        e.preventDefault();

        onUpdate(

            device.id,

            {

                name,

                device_type: deviceType,

                room,

            }

        );

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    Edit Device

                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
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

                            Save Changes

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditDeviceModal;