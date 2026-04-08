import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authReducer.js";
import favouriteReducer from "./favourites/favouriteReducer.js";
import cartReducer from "./cart/cartSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouriteReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
