import React, { useEffect, useMemo, useRef, useState } from "react";
import { addMinutes, differenceInSeconds, format } from "date-fns";
import { OTP_VERIFY_TIMEFRAME_MINUTES } from "@/utils/constants";

import styles from "./Otp.module.scss";

export type Props = {
  value: string;
  valueLength: number;
  otpIsInvalid: boolean;
  restartTimer: boolean;
  onChange: (value: string) => void;
  resendOtp: (data: any) => void;
};

const RE_DIGIT = new RegExp(/^\d+$/);
let interval: NodeJS.Timeout;

function calculateCountdown(targetTime: Date) {
  const currentTime = new Date();
  const difference = differenceInSeconds(targetTime, currentTime);
  const minutes = Math.floor(difference / 60);
  const seconds = difference % 60;
  return `${
    minutes > 0
      ? `${String(minutes)} ${minutes > 1 ? "minutes" : "minute"}`
      : ""
  } ${String(seconds).padStart(2, "0")} seconds`;
}

function secondsElapsed(targetTime: Date) {
  const currentTime = new Date();
  const difference = differenceInSeconds(targetTime, currentTime);
  const minutes = Math.floor(difference / 60);
  const seconds = difference % 60;
  return `${minutes}${seconds}`;
}

const Otp = ({
  value,
  valueLength,
  otpIsInvalid,
  restartTimer,
  onChange,
  resendOtp
}: Props) => {
  const [counter, setCounter] = useState(OTP_VERIFY_TIMEFRAME_MINUTES * 60);
  const [showCounter, setShowCounter] = useState(true);
  const targetTimeRef = useRef(
    addMinutes(new Date(), OTP_VERIFY_TIMEFRAME_MINUTES)
  );

  useEffect(() => {
    interval = setInterval(() => {
      if (secondsElapsed(targetTimeRef.current) === "00")
        return clearInterval(interval), setShowCounter(false);
      setCounter((prevState) => --prevState);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  useEffect(() => {
    setCounter(OTP_VERIFY_TIMEFRAME_MINUTES * 60);
    setShowCounter(true);
  }, [restartTimer]);

  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }

    return items;
  }, [value, valueLength]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };

  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") {
      return;
    }

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);

      onChange(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      const nextElementSibling =
        target.nextElementSibling as HTMLInputElement | null;

      if (nextElementSibling) {
        nextElementSibling.focus();
      }
      focusToNextInput(target);
    } else if (targetValueLength === valueLength) {
      onChange(targetValue);
      target.blur();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    if (e.key !== "Backspace" || target.value !== "") {
      return;
    }

    target.setSelectionRange(0, targetValue.length);

    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
    focusToPrevInput(target);
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  };

  return (
    <div className={styles.phone_auth}>
      <div className={styles.form}>
        {valueItems.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={valueLength}
            className={`${otpIsInvalid && styles.invalid_otp} ${
              styles.otp_input
            } size_25`}
            value={digit}
            onKeyDown={inputOnKeyDown}
            onChange={(e) => inputOnChange(e, idx)}
            onFocus={inputOnFocus}
          />
        ))}
      </div>
      {otpIsInvalid && (
        <span
          style={{ textAlign: "center" }}
          className={`${styles.error} size_12`}>
          The code you entered is incorrect. Please try again.
        </span>
      )}

      <div>
        <button
          type="button"
          onClick={async () => {
            resendOtp(value);
          }}
          className={`${styles.resend_btn} size_12`}>
          Resend token
        </button>
      </div>
    </div>
  );
};

export default Otp;
