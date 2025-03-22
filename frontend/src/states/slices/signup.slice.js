import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    registrationStep: 'initial', // 'initial', 'basic-info', 'user-info', 'completed'
    registrationData: null,
    error: null,
};

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        setRegistrationStep: (state, action) => {
            state.registrationStep = action.payload;
        },
        setRegistrationData: (state, action) => {
            state.registrationData = {
                ...state.registrationData,
                ...action.payload
            };
        },
        resetRegistration: (state) => {
            state.registrationStep = 'initial';
            state.registrationData = null;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const {
    setRegistrationStep,
    setRegistrationData,
    resetRegistration,
    setError
} = signupSlice.actions;

export default signupSlice.reducer;
