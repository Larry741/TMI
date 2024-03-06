import React, { Dispatch, useEffect } from "react";
import { useInput } from "../../hooks/use-Input";
import { InputType } from "@/interface/input";

import styles from "./Inputs.module.scss";

interface Props {
	value?: string;
	placeholder: string;
	label: string;
	focusable?: boolean;
	initRenderUpdate: boolean;
	updateInput: Dispatch<InputType>;
	validationFn: (value: string) => void;
}

const SearchInput = React.memo(
	({
		value,
		placeholder = "",
		label,
		focusable = true,
		initRenderUpdate = false,
		updateInput,
		validationFn = (value: string) => true,
	}: Props) => {
		const {
			enteredValue,
			inputIsValid,
			inputIsInvalid,
			inputIsTouched,
			inputBlured,
			inputBlurHandler,
			valueChangeHandler,
		} = useInput(validationFn, value);

		useEffect(() => {
			if (initRenderUpdate ? true : inputIsTouched) {
				updateInput({
					value: enteredValue,
					isValid: inputIsValid,
					isTouched: inputIsTouched,
				});
			}
		}, [
			enteredValue,
			inputIsValid,
			inputIsTouched,
			initRenderUpdate,
			updateInput,
		]);

		const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
			inputBlurHandler();
			valueChangeHandler(e);
		};

		return (
			<div className={styles.input_control}>
				{label ? (
					<label htmlFor={label} className={`${styles.label} size_15 bold`}>
						{label}
					</label>
				) : null}

				<input
					type={"search"}
					value={enteredValue}
					id={label}
					className={`${styles.input} ${styles.searchIcon} ${
						focusable ? styles.focusable : ""
					}`}
					placeholder={placeholder}
					autoComplete={"on"}
					onBlur={inputBlurHandler}
					onChange={inputChangeHandler}
				/>
			</div>
		);
	}
);
SearchInput.displayName = "SearchInput";

export default SearchInput;
