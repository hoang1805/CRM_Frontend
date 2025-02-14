import { createContext, useEffect, useState } from "react";
import helpers from "../utils/Helpers";

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [user, setUser] = useState(() => {
        const stored_user = localStorage.getItem('user');
        return stored_user ? helpers.decodeBase64(stored_user) : null;
    });


    useEffect(() => {
        const stored_user = localStorage.getItem('user');
        if (stored_user) {
            setUser(helpers.decodeBase64(stored_user));
        }
    }, []);

    const login = (user_data) => {
        let encoded_data = helpers.encodeBase64(user_data);
        localStorage.setItem('user', encoded_data);
        setUser(user_data);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
