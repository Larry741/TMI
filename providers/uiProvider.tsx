"use client"

import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppStoreType } from "@/store";
import { DARK_MODE_KEY, uiSliceAction } from "@/store/uiSlice";

const UiProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: AppStoreType) => state.ui);

  useEffect(() => {
    const is_dark_mode: boolean = JSON.parse(
      localStorage.getItem(DARK_MODE_KEY)!
    );

    if (is_dark_mode == false) {
      document.body.classList.remove("is_dark");
      dispatch(uiSliceAction.toggleDarkMode({ mode: false }));
    } else {
      document.body.classList.add("is_dark");
      dispatch(uiSliceAction.toggleDarkMode({ mode: true }));
    }
  });

  if (isDarkMode === "loading") {
    return <></>;
  }

  return <>{children}</>;
};

export default UiProvider;
