import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    notifications: [],
    loading: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setNotifications, setLoading } = notificationSlice.actions;
export default notificationSlice.reducer;