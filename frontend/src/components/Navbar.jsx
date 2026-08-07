import { FaBell, FaUserCircle } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user } = useAuth();

    return (

        <div className="navbar">

            <div>

                <h2>

                    Dashboard

                </h2>

                <p>

                    Welcome Back,

                    <strong>

                        {" "}

                        {user?.username || "User"}

                    </strong>

                    {" "}👋

                </p>

            </div>

            <div className="navbar-right">

                <button className="notification-btn">

                    <FaBell />

                </button>

                <div className="user-info">

                    <FaUserCircle size={35} />

                    <span>

                        {user?.username || "User"}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default Navbar;