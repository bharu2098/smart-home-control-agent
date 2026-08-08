import {
    createContext,
    useContext,
    useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [user, setUser] =
    useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });

    const [token, setToken] =
        useState(
            localStorage.getItem("token")
        );

   
    function login(
    userData,
    jwtToken,
) {

    localStorage.setItem(
        "token",
        jwtToken,
    );

    localStorage.setItem(
        "user",
        JSON.stringify(userData),
    );

    setUser(userData);

    setToken(jwtToken);

}

    function logout() {
        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        setToken(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}

export function useAuth() {

    return useContext(
        AuthContext
    );

}