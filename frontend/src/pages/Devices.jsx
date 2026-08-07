import { useEffect, useState } from "react";

import DeviceCard from "../components/DeviceCard";
import AddDeviceModal from "../components/AddDeviceModal";
import EditDeviceModal from "../components/EditDeviceModal";

import { apiRequest } from "../api/api";

function Devices() {

    const [devices, setDevices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [selectedDevice, setSelectedDevice] =
        useState(null);

    useEffect(() => {

        loadDevices();

    }, []);

    async function loadDevices() {

        try {

            const data =
                await apiRequest("/devices");

            setDevices(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    async function toggleDevice(id) {

        try {

            await apiRequest(

                `/devices/${id}/toggle`,

                "POST"

            );

            loadDevices();

        }

        catch (error) {

            console.error(error);

        }

    }

    async function addDevice(device) {

        try {

            await apiRequest(

                "/devices",

                "POST",

                device

            );

            setShowAddModal(false);

            loadDevices();

        }

        catch (error) {

            console.error(error);

        }

    }

    function openEdit(device) {

        setSelectedDevice(device);

        setShowEditModal(true);

    }

    async function updateDevice(

        id,

        updatedDevice

    ) {

        try {

            await apiRequest(

                `/devices/${id}`,

                "PUT",

                updatedDevice

            );

            setShowEditModal(false);

            setSelectedDevice(null);

            loadDevices();

        }

        catch (error) {

            console.error(error);

        }

    }

    async function deleteDevice(device) {

        const confirmDelete = window.confirm(

            `Delete "${device.name}" ?`

        );

        if (!confirmDelete) {

            return;

        }

        try {

            await apiRequest(

                `/devices/${device.id}`,

                "DELETE"

            );

            loadDevices();

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <div className="devices-page">

            <div className="devices-header">

                <div>

                    <h1>

                        Smart Devices

                    </h1>

                    <p>

                        Manage all connected smart devices.

                    </p>

                </div>

                <button

                    className="add-device-btn"

                    onClick={() =>

                        setShowAddModal(true)

                    }

                >

                    + Add Device

                </button>

            </div>

            {

                loading

                ?

                (

                    <h3>

                        Loading...

                    </h3>

                )

                :

                (

                    <div className="devices-grid">

                        {

                            devices.map(

                                (device) => (

                                    <DeviceCard

                                        key={device.id}

                                        device={device}

                                        onToggle={toggleDevice}

                                        onEdit={openEdit}

                                        onDelete={deleteDevice}

                                    />

                                )

                            )

                        }

                    </div>

                )

            }

            {

                showAddModal && (

                    <AddDeviceModal

                        onClose={() =>

                            setShowAddModal(false)

                        }

                        onAdd={addDevice}

                    />

                )

            }

            {

                showEditModal &&

                selectedDevice && (

                    <EditDeviceModal

                        device={selectedDevice}

                        onClose={() => {

                            setShowEditModal(false);

                            setSelectedDevice(null);

                        }}

                        onUpdate={updateDevice}

                    />

                )

            }

        </div>

    );

}

export default Devices;