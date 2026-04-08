import {
  GetFavouriteItems,
  AddItemToFavourites,
  RemoveItemFromFavourites,
} from "../../Api.js";
import toast from "react-hot-toast";
import { getUserFromCookie } from "../../utils/cookie.js";

// Get all favourites
export const getFavourites = () => {
  return async (dispatch) => {
    dispatch({ type: "GET_FAVOURITES_REQUEST" });

    try {
      const user = getUserFromCookie();
      const token = user?.token;
      
      if (!token) {
        dispatch({
          type: "GET_FAVOURITES_FAILURE",
          payload: "No authentication token found",
        });
        return;
      }
      
      const response = await GetFavouriteItems(token);
      dispatch({
        type: "GET_FAVOURITES_SUCCESS",
        payload: response.data || [],
      });
    } catch (err) {
      console.error("Favorites fetch error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load favourites";
      dispatch({
        type: "GET_FAVOURITES_FAILURE",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };
};

// Add to favourites
export const addToFavourites = (item) => {
  return async (dispatch) => {
    try {
      const user = getUserFromCookie();
      const token = user?.token;
      const response = await AddItemToFavourites(token, item); // returns updated favourites
      dispatch({ type: "SET_FAVOURITES", payload: response.data.favorites });
      toast.success(response.data.message || "Added to favourites");
    } catch (err) {
      toast.error(err.message || "Add to favourites failed");
    }
  };
};

// Remove from favourites
export const removeFromFavourites = (itemId) => {
  return async (dispatch) => {
    try {
      const user = getUserFromCookie();
      const token = user?.token;
      const response = await RemoveItemFromFavourites(token, itemId); // returns updated favourites
      console.log(response.data);
      dispatch({ type: "SET_FAVOURITES", payload: response.data.favorites });
      toast.success(response.data.message || "Removed from favourites");
    } catch (err) {
      toast.error(err.message || "Remove from favourites failed");
    }
  };
};
