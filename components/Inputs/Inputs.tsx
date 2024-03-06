import React, { Dispatch, useEffect, useRef } from "react";
import { useInput } from "../../hooks/use-Input";
import { InputType } from "@/interface/input";

import styles from "./Inputs.module.scss";

interface InputProps {
  value?: string;
  type?: string;
  required: boolean;
  placeholder: string;
  label: string;
  name?: string;
  showEditIcon?: boolean;
  focusable?: boolean;
  inputCanBeInvalid?: boolean;
  autoComplete?: "on" | "off" | "one-time-code";
  errorText?: string;
  readonly?: boolean;
  disabled?: boolean;
  resetInput?: number;
  initRenderUpdate: boolean;
  updateInput: Dispatch<InputType>;
  validationFn: (value: string) => void;
}

const Input = React.memo(
  ({
    value,
    type = "text",
    required = false,
    placeholder = "",
    label,
    name,
    showEditIcon = false,
    focusable = true,
    inputCanBeInvalid = true,
    autoComplete = "off",
    errorText,
    readonly = false,
    disabled = false,
    resetInput = 0,
    initRenderUpdate = false,
    updateInput,
    validationFn = (value: string) => true
  }: InputProps) => {
    const {
      enteredValue,
      inputIsValid,
      inputIsInvalid,
      inputBlured,
      inputIsTouched,
      inputBlurHandler,
      valueChangeHandler,
      reset
    } = useInput(validationFn, value);

    useEffect(() => {
      if (initRenderUpdate ? true : inputIsTouched) {
        updateInput({
          value: enteredValue,
          isValid: inputIsValid,
          isTouched: inputIsTouched
        });
      }
    }, [
      enteredValue,
      inputIsValid,
      inputIsTouched,
      initRenderUpdate,
      updateInput
    ]);

    useEffect(() => {
      if (resetInput > 0 && inputIsTouched) reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetInput, reset]);

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      valueChangeHandler(e);
    };

    return (
      <div
        className={`${styles.input_control} ${
          inputCanBeInvalid ? styles.control_margin : ""
        }`}>
        {label ? (
          <label htmlFor={label} className={`${styles.label} size_15 bold`}>
            {label}
          </label>
        ) : (
          ""
        )}
        <input
          type={type}
          required={required}
          value={enteredValue}
          className={`${styles.input} ${showEditIcon ? styles.editIcon : ""} ${
            focusable ? styles.focusable : ""
          } ${
            inputIsInvalid && focusable && inputCanBeInvalid
              ? `${styles.invalid}`
              : ""
          }`}
          id={label}
          autoComplete="off"
          placeholder={placeholder}
          readOnly={readonly}
          name={name}
          disabled={disabled}
          onBlur={inputBlurHandler}
          onChange={inputChangeHandler}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
