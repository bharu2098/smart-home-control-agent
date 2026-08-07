import { useEffect, useState } from "react";

import AutomationCard from "../components/AutomationCard";
import AddAutomationModal from "../components/AddAutomationModal";
import EditAutomationModal from "../components/EditAutomationModal";

import { apiRequest } from "../api/api";

function Automations() {

    const [automations, setAutomations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [selectedAutomation, setSelectedAutomation] =
        useState(null);

    useEffect(() => {

        loadAutomations();

    }, []);

    async function loadAutomations() {

        try {

            const data =
                await apiRequest(
                    "/automations"
                );

            setAutomations(data);

        }

        catch (error) {

            console.error(
                "Load Automations:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    }

    function openEdit(automation) {

        setSelectedAutomation(
            automation
        );

        setShowEditModal(true);

    }

    async function addAutomation(data) {

        try {

            await apiRequest(

                "/automations",

                "POST",

                data

            );

            setShowAddModal(false);

            loadAutomations();

        }

        catch (error) {

            console.error(
                "Add Automation:",
                error
            );

        }

    }

    async function updateAutomation(

        id,

        data

    ) {

        try {

            await apiRequest(

                `/automations/${id}`,

                "PUT",

                data

            );

            setShowEditModal(false);

            setSelectedAutomation(null);

            loadAutomations();

        }

        catch (error) {

            console.error(
                "Update Automation:",
                error
            );

        }

    }

    async function deleteAutomation(
        automation
    ) {

        const confirmDelete =
            window.confirm(

                `Delete "${automation.name}"?`

            );

        if (!confirmDelete) {

            return;

        }

        try {

            await apiRequest(

                `/automations/${automation.id}`,

                "DELETE"

            );

            loadAutomations();

        }

        catch (error) {

            console.error(
                "Delete Automation:",
                error
            );

        }

    }

    async function toggleAutomation(id) {

        try {

            await apiRequest(

                `/automations/${id}/toggle`,

                "POST"

            );

            loadAutomations();

        }

        catch (error) {

            console.error(

                "Toggle Automation:",

                error

            );

        }

    }

    return (

        <div className="devices-page">

            <div className="devices-header">

                <div>

                    <h1>

                        Smart Automations

                    </h1>

                    <p>

                        Manage all your smart automations.

                    </p>

                </div>

                <button

                    className="add-device-btn"

                    onClick={() =>

                        setShowAddModal(true)

                    }

                >

                    + Add Automation

                </button>

            </div>

            {

                loading

                ?

                (

                    <h2>

                        Loading...

                    </h2>

                )

                :

                (

                    <div className="devices-grid">

                        {

                            automations.map(

                                (

                                    automation

                                ) => (

                                    <AutomationCard

                                        key={
                                            automation.id
                                        }

                                        automation={
                                            automation
                                        }

                                        onToggle={
                                            toggleAutomation
                                        }

                                        onEdit={
                                            openEdit
                                        }

                                        onDelete={
                                            deleteAutomation
                                        }

                                    />

                                )

                            )

                        }

                    </div>

                )

            }

            {

                showAddModal && (

                    <AddAutomationModal

                        onClose={() =>

                            setShowAddModal(false)

                        }

                        onAdd={
                            addAutomation
                        }

                    />

                )

            }

            {

                showEditModal &&

                selectedAutomation && (

                    <EditAutomationModal

                        automation={
                            selectedAutomation
                        }

                        onClose={() => {

                            setShowEditModal(false);

                            setSelectedAutomation(null);

                        }}

                        onUpdate={
                            updateAutomation
                        }

                    />

                )

            }

        </div>

    );

}

export default Automations;