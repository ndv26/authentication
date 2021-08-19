import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./AuthForm.module.css";
import useInput from "../hooks/useInput";
import AuthContext from "../../store/auth-context";

const validateEmail = (value) => value.trim().includes("@");
const validatePassword = (value) => value.trim().length >= 6;

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const history = useHistory();

    const {
        inputValue: email,
        isValid: emailIsValid,
        hasError: emailHasError,
        inputChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail,
    } = useInput(validateEmail);

    const {
        inputValue: password,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        inputChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword,
    } = useInput(validatePassword);

    const emailClasses = emailHasError
        ? `${classes.control} ${classes.invalid}`
        : `${classes.control}`;

    const passwordClasses = passwordHasError
        ? `${classes.control} ${classes.invalid}`
        : `${classes.control}`;

    let formIsValid = false;

    if (emailIsValid && passwordIsValid) {
        formIsValid = true;
    }

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const enteredEmail = email;
        const enteredPassword = password;
        setIsLoading(true);

        let url;

        if (formIsValid && isLogin) {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDNcGhh2xagYuZkeCvRCCR7ovtxPQhwZwQ";
        } else if (formIsValid && !isLogin) {
            url =
                "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDNcGhh2xagYuZkeCvRCCR7ovtxPQhwZwQ";
        } else {
            return;
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
                returnSecureToken: true,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                setIsLoading(false);
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((data) => {
                        let errorMessage = "Authentication failed!";
                        if (data && data.error && data.error.message) {
                            errorMessage = data.error.message;
                        }
                        throw new Error(errorMessage);
                    });
                }
            })
            .then((data) => {
                const expirationTime = new Date(
                    new Date().getTime() + +data.expiresIn * 1000
                );
                authContext.login(data.idToken, expirationTime);
                history.replace("/");
            })
            .catch((error) => {
                alert(error.message);
            });

        resetEmail();
        resetPassword();
    };

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? "Login" : "Sign Up"}</h1>
            <form onSubmit={submitHandler}>
                <div className={emailClasses}>
                    <label htmlFor="email">Your Email</label>
                    <input
                        type="email"
                        id="email"
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                        value={email}
                        required
                    />
                    {emailHasError && <p>Please enter a valid email.</p>}
                </div>
                <div className={passwordClasses}>
                    <label htmlFor="password">Your Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        value={password}
                        required
                    />
                    {passwordHasError && (
                        <p>{`Please enter a valid password. (≥ 6 characters)`}</p>
                    )}
                </div>
                <div className={classes.actions}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <button>{isLogin ? "Login" : "Create Account"}</button>
                    )}
                    <button
                        type="button"
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin
                            ? "Create new account"
                            : "Login with existing account"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;
