export interface PasswordInputType extends InputType {
	includesNum: boolean;
	includesSpecialChar: boolean;
	hasMin8char: boolean;
	includesCapitalLetter: boolean;
}

export interface InputType {
	value: string;
	isValid: boolean;
	name?: string;
	isTouched?: boolean;
	isFocused?: boolean;
}

export interface SelectInputType {
	value: string;
	isValid: boolean;
	name?: string;
	isTouched?: boolean;
	isFocused?: boolean;
	required?: boolean;
}

export interface CountryInputType {
	value: string;
	name?: string;
	iso2: string;
	isValid: boolean;
}
