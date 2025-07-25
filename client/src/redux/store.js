import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export { store };
