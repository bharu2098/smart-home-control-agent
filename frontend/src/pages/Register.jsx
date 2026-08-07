import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../api/api";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRegister(e) {

        e.preventDefault();

        setError("");

        if (

            !username.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()

        ) {

            setError("All fields are required.");

            return;

        }

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            await apiRequest(

                "/auth/register",

                "POST",

                {

                    username,

                    email,

                    password,

                }

            );

            alert("Registration Successful!");

            navigate("/login");

        }

        catch (error) {

    console.error(error);

    if (error.data) {

        setError(

            error.data.detail ||

            error.data.message ||

            error.message

        );

    }

    else {

        setError(

            error.message ||

            "Unable to connect to server."

        );

    }

}

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>

                    Smart Home

                </h1>

                <h2>

                    Create Account 🚀

                </h2>

                <form onSubmit={handleRegister}>

                    <input

                        type="text"

                        placeholder="Username"

                        value={username}

                        onChange={(e) =>

                            setUsername(e.target.value)

                        }

                    />

                    <input

                        type="email"

                        placeholder="Email Address"

                        value={email}

                        onChange={(e) =>

                            setEmail(e.target.value)

                        }

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e) =>

                            setPassword(e.target.value)

                        }

                    />

                    <input

                        type="password"

                        placeholder="Confirm Password"

                        value={confirmPassword}

                        onChange={(e) =>

                            setConfirmPassword(e.target.value)

                        }

                    />

                    {

                        error && (

                            <p

                                style={{

                                    color: "#ff6b6b",

                                    textAlign: "center",

                                    fontSize: "14px",

                                    marginBottom: "10px",

                                }}

                            >

                                {error}

                            </p>

                        )

                    }

                    <button

                        type="submit"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Creating Account..."

                                : "Register"

                        }

                    </button>

                </form>

                <p>

                    Already have an account?{" "}

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;