import { useState } from "react";

const useInput = (validateValue) => {
    const [inputValue, setInputValue] = useState("");
    const [isTouched, setIsTouched] = useState(false);

    const isValid = validateValue(inputValue);
    const hasError = !isValid && isTouched;

    const inputChangeHandler = (event) => {
        setInputValue(event.target.value);
    };

    const inputBlurHandler = () => {
        setIsTouched(true);
    };

    const reset = () => {
        setInputValue("");
        setIsTouched(false);
    };

    return {
        inputValue,
        isValid,
        hasError,
        inputChangeHandler,
        inputBlurHandler,
        reset,
    };
};

export default useInput;
