import {
    FaHome,
    FaMicrochip,
    FaRobot,
    FaClock,
    FaUser,
    FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <div className="sidebar">

            <div className="sidebar-logo">

                <h2>

                    Smart Home

                </h2>

            </div>

            <nav>

                <NavLink
                    to="/dashboard"
                >

                    <FaHome />

                    Dashboard

                </NavLink>

                <NavLink
                    to="/devices"
                >

                    <FaMicrochip />

                    Devices

                </NavLink>

                <NavLink
                    to="/chat"
                >

                    <FaRobot />

                    AI Chat

                </NavLink>

                <NavLink
                    to="/automations"
                >

                    <FaClock />

                    Automations

                </NavLink>

                <NavLink
                    to="/profile"
                >

                    <FaUser />

                    Profile

                </NavLink>

            </nav>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >

                <FaSignOutAlt />

                Logout

            </button>

        </div>

    );

}

export default Sidebar;