import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    all: {},
    list: {},
    detail: {},
    archived: {},
};

const resourceSlice = createSlice({
    name: "resources",
    initialState,
    reducers: {
        setResource: (state, action) => {
            const { resource, data, type = 'all' } = action.payload;
            if (!resource || !data) return;
            state[type][resource] = data;
        },
        deleteResource: (state, action) => {
            const { resource, type } = action.payload;
            if (!resource) return;
            state[type][resource] = undefined;
        },
        clear: (state) => {
            state.resources = {};
        }
    },
});

export const {
    setResource,
    deleteResource,
    clear
} = resourceSlice.actions;
export default resourceSlice.reducer;