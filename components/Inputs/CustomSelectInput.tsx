import React, {
  Dispatch,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { InputType } from "@/interface/input";
import useFetcher from "@/hooks/use-Fetcher";
import { useInput } from "@/hooks/use-Input";
import getScrollParent from "@/utils/getScrollableParent";

import styles from "./CustomSelectInput.module.scss";
import Image from "next/image";

export interface InputOptions {
  key: number | string;
  value: string;
}

interface SelectInputProps {
  label: string;
  resetInput?: boolean;
  initialValue?: string;
  disabledSelection?: string;
  inputCanBeInvalid?: boolean;
  defaultSelection?: string;
  optionsArr?: InputOptions[];
  isFocusAble?: boolean;
  initRenderUpdate?: boolean;
  subParam?: number | string;
  queryParam?:
    | "occupation"
    | "industry"
    | "country"
    | "state"
    | "propertyCategory"
    | "propertyType"
    | "propertyUse"
    | "propertyStatus"
    | "assetClass"
    | "idType";
  required?: boolean;
  disabled?: boolean;
  setRequired?: Dispatch<boolean>;
  updateInput: Dispatch<InputType>;
  validationFn?: (value: string) => boolean;
  inputChanged?: Dispatch<(prevState: number) => number>;
}

interface Style {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
}

export const SELECT_SELECTIONS = {
  disabled: "none",
  default: "all"
};

const CustomSelectInput = ({
  label,
  resetInput,
  optionsArr,
  queryParam,
  subParam,
  initialValue,
  defaultSelection,
  disabledSelection,
  inputCanBeInvalid = true,
  isFocusAble = true,
  required,
  disabled = false,
  initRenderUpdate = false,
  setRequired,
  updateInput,
  validationFn = (val: string) => val !== "none"
}: SelectInputProps) => {
  const { data } = useFetcher(
    queryParam
      ? `utils/table-data?table=${queryParam}${
          subParam ? `&sub=${subParam}` : ""
        }`
      : ""
  );
  const inputContRef = useRef<HTMLDivElement>(null);
  const [dropdownIsVisible, setDropdownIsVisible] = useState<boolean>(false);
  const {
    enteredValue,
    inputIsValid,
    inputIsInvalid,
    inputIsTouched,
    inputBlured,
    inputBlurHandler,
    valueChangeHandler,
    reset
  } = useInput(
    (val: string) => val !== SELECT_SELECTIONS.disabled,
    initialValue
      ? initialValue
      : disabledSelection
      ? SELECT_SELECTIONS.disabled
      : defaultSelection
      ? SELECT_SELECTIONS.default
      : optionsArr && optionsArr.length > 0
      ? `${optionsArr[0].key}`
      : ""
  );
  const [style, setStyle] = useState<Style>();
  const closeInputHandlerRef = useRef<() => void>();
  const dropdownListdropDownListRef = useRef<HTMLUListElement>(null);
  const inputKeyValueMap = useRef<{ [key in string]?: string }>({});
  defaultSelection
    ? (inputKeyValueMap.current[SELECT_SELECTIONS.default] = defaultSelection)
    : null;

  useEffect(() => {
    if (queryParam && !data?.data.length) return;

    if (initRenderUpdate ? true : inputIsTouched) {
      updateInput({
        value: enteredValue === SELECT_SELECTIONS.default ? "" : enteredValue,
        isValid: inputIsValid,
        isTouched: inputIsTouched,
        name: inputKeyValueMap.current[`${enteredValue}`]
      });
    }
  }, [
    enteredValue,
    queryParam,
    inputIsValid,
    inputIsTouched,
    updateInput,
    data?.data,
    initRenderUpdate
  ]);

  useEffect(() => {
    if (resetInput == true || (resetInput === false && inputIsTouched)) {
      reset();
    }
  }, [resetInput, inputIsTouched, reset]);

  useEffect(() => {
    if (required && inputContRef.current) {
      inputContRef.current.scrollIntoView();
    }
  }, [required]);

  const inputChangeHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const event: React.ChangeEvent<HTMLInputElement> = {
      target: {
        // @ts-ignore
        value: e.currentTarget.dataset.selectVal
      }
    };
    valueChangeHandler(event);
    if (required && setRequired) setRequired(false);
    setDropdownIsVisible(false);
  };

  const options = useMemo<InputOptions[]>(() => {
    if (optionsArr) {
      return optionsArr.map((option) => {
        inputKeyValueMap.current[`${option.key}`] = option.value;
        return option;
      });
    } else if (data?.data) {
      return data.data.map((fetchedInputData: InputOptions) => {
        inputKeyValueMap.current[`${fetchedInputData.key}`] =
          fetchedInputData.value;
        return {
          key: fetchedInputData.key,
          value: fetchedInputData.value
        };
      });
    }
    return [];
  }, [data?.data, optionsArr]);

  const scrollResizeEventHandler = useCallback(() => {
    setStyle(getDropdownStyle(dropdownListdropDownListRef.current!));
  }, []);

  useEffect(() => {
    const unsubscribeRef = dropdownListdropDownListRef.current!;
    const scrollContainer = getScrollParent(unsubscribeRef);

    closeInputHandlerRef.current = () => {
      if (!dropdownIsVisible) return;

      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", scrollResizeEventHandler);
      }
      window.removeEventListener("resize", scrollResizeEventHandler);

      setDropdownIsVisible(false);
      inputBlurHandler();
    };

    if (dropdownIsVisible) {
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", scrollResizeEventHandler);
      }
      window.addEventListener("resize", scrollResizeEventHandler);
      document.documentElement.addEventListener(
        "click",
        closeInputHandlerRef.current
      );
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", scrollResizeEventHandler);
      }
      document.documentElement.removeEventListener(
        "click",
        closeInputHandlerRef.current!
      );
      window.removeEventListener("resize", scrollResizeEventHandler);
    };
  }, [
    dropdownIsVisible,
    dropdownListdropDownListRef,
    inputBlurHandler,
    scrollResizeEventHandler
  ]);

  const showSelectDropdown = useCallback(
    (e: React.MouseEvent<HTMLUListElement>) => {
      const scrollContainer = getScrollParent(e.currentTarget);
      if (!scrollContainer) return;

      if (!dropdownIsVisible) {
        scrollResizeEventHandler();
        setDropdownIsVisible(true);
      } else {
        setDropdownIsVisible(false);
      }
    },
    [dropdownIsVisible, scrollResizeEventHandler]
  );

  return (
    <>
      <div
        id="select_input_container"
        ref={inputContRef}
        className={`${styles.input_control}`}>
        {label ? (
          <label className={`${styles.label} size_15 bold`} htmlFor={label}>
            {label}
          </label>
        ) : (
          ""
        )}

        <ul
          onClick={(e: React.MouseEvent<HTMLUListElement>) => {
            if (disabled) return;
            e.stopPropagation();
            document.documentElement.click();
            showSelectDropdown(e);
          }}
          ref={dropdownListdropDownListRef}
          className={`${styles.dropdownListInput} ${
            dropdownIsVisible && isFocusAble ? styles.focused : ""
          } ${disabled ? styles.disabled : ""}  ${
            (inputIsInvalid && disabledSelection && inputCanBeInvalid) ||
            required
              ? `${styles.invalid}`
              : ""
          } size_16`}>
          <li
            className={`${styles.display_list_item} ${
              enteredValue === SELECT_SELECTIONS.disabled
                ? styles.disabled_selection
                : ""
            }`}>
            {enteredValue === SELECT_SELECTIONS.disabled
              ? disabledSelection
              : inputKeyValueMap.current[`${enteredValue}`]}
          </li>

          {dropdownIsVisible ? (
            <>
              {createPortal(
                <ul
                  style={style}
                  className={`${styles.dropdown_container} hide-scrollbar size_16`}>
                  {defaultSelection && (
                    <li
                      onClick={inputChangeHandler}
                      className={`${styles.dropdown_li}`}
                      data-select-val={SELECT_SELECTIONS.default}>
                      <span>{defaultSelection} </span>
                    </li>
                  )}

                  {options.length ? (
                    options.map((option, idx) => {
                      return (
                        <li
                          key={idx}
                          onClick={inputChangeHandler}
                          data-select-val={`${option.key}`}
                          className={`${styles.dropdown_li}`}>
                          <span>{option.value}</span>
                        </li>
                      );
                    })
                  ) : !disabledSelection && !defaultSelection ? (
                    <div className={styles.empty_list}></div>
                  ) : (
                    <></>
                  )}
                </ul>,
                document.body
              )}
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </>
  );
};

export default React.memo(CustomSelectInput);

const getDropdownStyle = (targetParentElement: HTMLElement): Style => {
  const elRectBottom = targetParentElement.getBoundingClientRect().top + 352;

  let elStyle: Style = {
    left: targetParentElement.getBoundingClientRect().left,
    width: targetParentElement.getBoundingClientRect().width
  };

  if (elRectBottom > document.documentElement.clientHeight) {
    elStyle.bottom =
      document.documentElement.clientHeight -
      targetParentElement.getBoundingClientRect().bottom +
      targetParentElement.getBoundingClientRect().height;
  } else {
    elStyle.top =
      targetParentElement.getBoundingClientRect().top +
      targetParentElement.getBoundingClientRect().height;
  }
  return elStyle;
};
