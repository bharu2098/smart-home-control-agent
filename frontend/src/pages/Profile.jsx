import { useAuth } from "../context/AuthContext";

function Profile() {

    const { user } = useAuth();

    return (

        <div>

            <h1 className="page-title">
                Profile
            </h1>

            <div className="profile-card">

                <div className="profile-avatar">

                    👤

                </div>

                <h2>

                    {user?.username || "Unknown User"}

                </h2>

                <p>

                    <strong>Email:</strong>{" "}

                    {user?.email || "Not Available"}

                </p>

                <p>

                    <strong>Role:</strong> Smart Home User

                </p>

                <p>

                    <strong>Status:</strong>

                    <span
                        style={{
                            color: "#00d26a",
                            marginLeft: "8px",
                            fontWeight: "bold",
                        }}
                    >

                        Active

                    </span>

                </p>

            </div>

        </div>

    );

}

export default Profile;