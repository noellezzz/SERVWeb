import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    refresh: false,
};

const resourceSlice = createSlice({
    name: "resources",
    initialState,
    reducers: {
        toggleRefresh: (state, action) => {
            state.refresh = action.payload || !state.refresh;
        },
    },
});

export const {
    toggleRefresh,
} = resourceSlice.actions;
export default resourceSlice.reducer;