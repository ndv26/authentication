import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const expireTime = new Date(expirationTime).getTime();
    const remainingTime = expireTime - currentTime;
    return remainingTime;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem("token");
    const storedExpirationTime = localStorage.getItem("expirationTime");
    const remainingTime = calculateRemainingTime(storedExpirationTime);
    if (remainingTime < 6000) {
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        return null;
    }
    return {
        token: storedToken,
        expirationTime: remainingTime,
    };
};

export const AuthContextProvider = (props) => {
    const storedToken = retrieveStoredToken();
    let initialToken;

    if (storedToken) {
        initialToken = storedToken.token;
    }

    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("expirationTime");
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        localStorage.setItem("token", token);
        localStorage.setItem("expirationTime", expirationTime);
        setToken(token);
        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (storedToken) {
            console.log(storedToken.expirationTime);
            logoutTimer = setTimeout(logoutHandler, storedToken.expirationTime);
        }
    }, [storedToken, logoutHandler]);

    const contextValue = {
        token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
