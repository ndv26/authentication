import { useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./ProfileForm.module.css";
import useInput from "../hooks/useInput";
import AuthContext from "../../store/auth-context";

const validateNewPassword = (value) => value.trim().length >= 6;

const ProfileForm = () => {
    const authContext = useContext(AuthContext);
    const history = useHistory();

    const {
        inputValue: newPassword,
        isValid: newPasswordIsValid,
        hasError: newPasswordHasError,
        inputChangeHandler: newPasswordChangeHandler,
        inputBlurHandler: newPasswordBlurHandler,
        reset: resetNewPassword,
    } = useInput(validateNewPassword);

    const newPasswordClasses = newPasswordHasError
        ? `${classes.control} ${classes.invalid}`
        : classes.control;

    let formIsValid = false;

    if (newPasswordIsValid) {
        formIsValid = true;
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const enteredNewPassword = newPassword;
        if (formIsValid) {
            fetch(
                "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDNcGhh2xagYuZkeCvRCCR7ovtxPQhwZwQ",
                {
                    method: "POST",
                    body: JSON.stringify({
                        idToken: authContext.token,
                        password: enteredNewPassword,
                        returnSecureToken: false,
                    }),
                    headers: { "Content-Type": "application/json" },
                }
            ).then((response) => {
                alert("Password changed successfully!");
                history.replace("/");
            });
        }
        resetNewPassword();
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <div className={newPasswordClasses}>
                <label htmlFor="new-password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    onChange={newPasswordChangeHandler}
                    onBlur={newPasswordBlurHandler}
                    value={newPassword}
                />
                {newPasswordHasError && <p>Please enter your new password.</p>}
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
};

export default ProfileForm;
