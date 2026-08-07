import { useEffect, useState } from "react";

import StatCard from "../components/StatCard";
import { apiRequest } from "../api/api";

function Dashboard() {

    const [stats, setStats] = useState({

        totalDevices: 0,

        onlineDevices: 0,

        offlineDevices: 0,

        automations: 0,

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const [

                devices,

                automations,

            ] = await Promise.all([

                apiRequest("/devices"),

                apiRequest("/automations"),

            ]);

            const totalDevices =
                devices.length;

            const onlineDevices =
                devices.filter(

                    (device) => device.status

                ).length;

            const offlineDevices =
                totalDevices -
                onlineDevices;

            const totalAutomations =
                automations.length;

            setStats({

                totalDevices,

                onlineDevices,

                offlineDevices,

                automations: totalAutomations,

            });

        }

        catch (error) {

            console.error(

                "Dashboard Error:",

                error

            );

        }

    }

    return (

        <div className="dashboard-page">

            <div className="dashboard-header">

                <h1>

                    Smart Home Overview

                </h1>

                <p>

                    Monitor and control your smart home devices from one place.

                </p>

            </div>

            <div className="stats-grid">

                <StatCard

                    title="Total Devices"

                    value={stats.totalDevices}

                    color="#2f7df6"

                />

                <StatCard

                    title="Online Devices"

                    value={stats.onlineDevices}

                    color="#22c55e"

                />

                <StatCard

                    title="Offline Devices"

                    value={stats.offlineDevices}

                    color="#ef4444"

                />

                <StatCard

                    title="Automations"

                    value={stats.automations}

                    color="#f59e0b"

                />

            </div>

        </div>

    );

}

export default Dashboard;