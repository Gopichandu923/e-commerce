import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer.js";
import favouriteReducer from "./favourites/favouriteReducer.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouriteReducer,
  },
});

export default store;
