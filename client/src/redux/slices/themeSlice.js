import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    initialTheme: localStorage.getItem('theme') ||  "light",
}
const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            localStorage.setItem('theme', action.payload);
            state.initialTheme = action.payload;
        },
    },
});
export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;