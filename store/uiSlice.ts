import { createAsyncThunk, createSlice, Dispatch } from "@reduxjs/toolkit";

export const DARK_MODE_KEY = "dark-mode";
const initialState: { isDarkMode: boolean | "loading" } = {
  isDarkMode: "loading"
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.isDarkMode = action.payload.mode;

      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(state.isDarkMode));
    },
    reset: () => initialState
  }
});

export default uiSlice;

export const uiSliceAction = uiSlice.actions;
