import {
  GetFavouriteItems,
  AddItemToFavourites,
  RemoveItemFromFavourites,
} from "../../Api.js";
import toast from "react-hot-toast";

// Get all favourites
export const getFavourites = () => {
  return async (dispatch) => {
    dispatch({ type: "GET_FAVOURITES_REQUEST" });

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const response = await GetFavouriteItems(token);
      dispatch({
        type: "GET_FAVOURITES_SUCCESS",
        payload: response.data, // assuming API returns favourites list
      });
    } catch (err) {
      dispatch({
        type: "GET_FAVOURITES_FAILURE",
        payload: err.message,
      });
      toast.error(err.message || "Failed to load favourites");
    }
  };
};

// Add to favourites
export const addToFavourites = (item) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
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
      const user = JSON.parse(localStorage.getItem("user"));
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
