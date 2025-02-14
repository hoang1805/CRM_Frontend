import { configureStore } from "@reduxjs/toolkit";
import client_reducer from "./client.slice";

const store = configureStore({
    reducer: {
        client: client_reducer
    },
});

export default store;