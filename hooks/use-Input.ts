import { useState, useCallback } from "react";

export const useInput = (validationFn: Function, initialValue?: string) => {
  const [enteredValue, setEnteredValue] = useState<string>(initialValue || "");
  const [inputIsChanged, setInputIsChanged] = useState<boolean>(false);
  const [inputBlured, setInputIsBlur] = useState<boolean>();
  const [inputIsTouched, setInputIsTouched] = useState<boolean>(false);

  const inputIsValid = validationFn(enteredValue);
  const inputIsInvalid = !inputIsValid && inputBlured;

  const inputBlurHandler = useCallback(() => {
    setInputIsBlur(true);
  }, []);

  const valueChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setInputIsChanged(true);
      setInputIsTouched(true);
      setEnteredValue(e.target.value);
    },
    []
  );

  const resetIsChanged = useCallback(() => {
    setInputIsChanged(false);
  }, []);

  const reset = useCallback(() => {
    setEnteredValue("");
    setInputIsChanged(false);
    setInputIsBlur(false);
    setInputIsTouched(false);
  }, []);

  return {
    enteredValue,
    inputIsValid,
    inputIsInvalid,
    inputIsChanged,
    inputIsTouched,
    inputBlured,
    inputBlurHandler,
    valueChangeHandler,
    resetIsChanged,
    reset
  };
};
