import { useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {

    const location = useLocation();

    const hideNavbar =
        location.pathname === "/chat";

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                {!hideNavbar && <Navbar />}

                {children}

            </div>

        </div>

    );

}

export default DashboardLayout;