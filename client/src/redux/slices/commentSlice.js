import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    comments: []
};

export const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setComments, setLoading } = commentSlice.actions;
export default commentSlice.reducer