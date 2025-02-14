import { createSlice } from "@reduxjs/toolkit";

const initial_state = {};
const initialState = initial_state;

const client_slice = createSlice({
    name: 'Client',
    initialState,
    reducers: {
        register: (state, action) => {
            const {key, value} = action.payload;
            state[key] = value;
        },
        remove: (state, action) => {
            delete state[action.payload];
        },
        update: (state, action) => {
            const {key, value} = action.payload;
            if (typeof value === 'function') {
                state[key] = value(state[key]);
            } else {
                state[key] = value;
            }
        },
        clear: () => initial_state
    }
});

export const {register, remove, update, clear} = client_slice.actions;

export default client_slice.reducer;