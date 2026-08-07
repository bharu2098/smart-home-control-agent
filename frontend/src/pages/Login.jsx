import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleLogin(e) {

        e.preventDefault();

        setError("");

        if (

            !email ||

            !password

        ) {

            setError(

                "All fields are required."

            );

            return;

        }

        try {

            setLoading(true);

            const response =
                await apiRequest(

                    "/auth/login",

                    "POST",

                    {

                        email,

                        password,

                    }

                );

            login(

                response.user,

                response.access_token,

            );

            localStorage.setItem(

                "token",

                response.access_token,

            );

            alert(

                "Login Successful!"

            );

            navigate(

                "/dashboard"

            );

        }

        catch (error) {

            console.error(error);

            setError(

                error.message ||

                "Unable to connect to server."

            );

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

                    Welcome Back 👋

                </h2>

                <form
                    onSubmit={handleLogin}
                >

                    <input

                        type="email"

                        placeholder="Email Address"

                        value={email}

                        onChange={(e) =>

                            setEmail(

                                e.target.value

                            )

                        }

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e) =>

                            setPassword(

                                e.target.value

                            )

                        }

                    />

                    {

                        error && (

                            <p

                                style={{

                                    color: "#ff6b6b",

                                    textAlign: "center",

                                    fontSize: "14px",

                                    marginBottom: "15px",

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

                                ? "Signing In..."

                                : "Login"

                        }

                    </button>

                </form>

                <p>

                    Don't have an account?

                    <Link

                        to="/register"

                    >

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;