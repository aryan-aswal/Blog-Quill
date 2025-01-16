import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import blogSlice from "../slices/blogSlice";
import notificationSlice from "../slices/notificationSlice";
import themeSlice from "../slices/themeSlice";

export const rootReducer = combineReducers({
    auth: authSlice,
    blog: blogSlice,
    notification: notificationSlice,
    theme: themeSlice,
})