import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Devices from "../pages/Devices";
import Automations from "../pages/Automations";
import AIChat from "../pages/AIChat";
import Profile from "../pages/Profile";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {

    return (

        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>

                        <DashboardLayout>

                            <Dashboard />

                        </DashboardLayout>

                    </ProtectedRoute>
                }
            />

            <Route
                path="/devices"
                element={
                    <ProtectedRoute>

                        <DashboardLayout>

                            <Devices />

                        </DashboardLayout>

                    </ProtectedRoute>
                }
            />

            <Route
                path="/automations"
                element={
                    <ProtectedRoute>

                        <DashboardLayout>

                            <Automations />

                        </DashboardLayout>

                    </ProtectedRoute>
                }
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>

                        <DashboardLayout>

                            <AIChat />

                        </DashboardLayout>

                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>

                        <DashboardLayout>

                            <Profile />

                        </DashboardLayout>

                    </ProtectedRoute>
                }
            />

        </Routes>

    );

}

export default AppRoutes;