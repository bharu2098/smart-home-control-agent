const BASE_URL = "https://smart-home-control-agent.onrender.com";

export async function apiRequest(
    endpoint,
    method = "GET",
    body = null,
) {
    const token =
        localStorage.getItem("token");

    const options = {
        method,
        headers: {
            "Content-Type":
                "application/json",
        },
    };

    if (token) {
        options.headers.Authorization =
            `Bearer ${token}`;
    }

    if (body) {
        options.body =
            JSON.stringify(body);
    }

    const response = await fetch(
        `${BASE_URL}${endpoint}`,
        options,
    );

    const data =
        await response.json();

    if (!response.ok) {
        const error =
            new Error(
                data.detail ||
                data.message ||
                "Request failed"
            );

        error.status =
            response.status;

        error.data =
            data;

        throw error;
    }

    return data;
}