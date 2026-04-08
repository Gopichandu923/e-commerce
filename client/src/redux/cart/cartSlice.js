import { GetCartItems, UpdateCart, DeleteCartItem, DeleteCartItems } from "../../Api.js";
import { getUserFromCookie } from "../../utils/cookie.js";
import toast from "react-hot-toast";

const getToken = () => {
  const user = getUserFromCookie();
  return user?.token;
};

export const getCartItems = () => {
  return async (dispatch) => {
    dispatch({ type: "GET_CART_REQUEST" });
    const token = getToken();

    if (!token) {
      dispatch({ type: "GET_CART_SUCCESS", payload: [] });
      return;
    }

    try {
      const response = await GetCartItems(token);
      dispatch({ type: "GET_CART_SUCCESS", payload: response.data || [] });
    } catch (err) {
      dispatch({ type: "GET_CART_FAILURE", payload: err.message });
      toast.error(err.message || "Failed to load cart");
    }
  };
};

export const updateCartItem = (itemId, quantity) => {
  return async (dispatch, getState) => {
    dispatch({ type: "UPDATE_CART_REQUEST" });
    const token = getToken();

    try {
      await UpdateCart(token, itemId, quantity);
      dispatch({ type: "UPDATE_CART_SUCCESS" });
      toast.success("Cart updated");
      dispatch(getCartItems());
    } catch (err) {
      dispatch({ type: "UPDATE_CART_FAILURE", payload: err.message });
      toast.error(err.message || "Failed to update item");
    }
  };
};

export const removeCartItem = (itemId) => {
  return async (dispatch) => {
    dispatch({ type: "REMOVE_CART_REQUEST" });
    const token = getToken();

    try {
      await DeleteCartItem(token, itemId);
      dispatch({ type: "REMOVE_CART_SUCCESS" });
      toast.success("Item removed");
      dispatch(getCartItems());
    } catch (err) {
      dispatch({ type: "REMOVE_CART_FAILURE", payload: err.message });
      toast.error(err.message || "Failed to remove item");
    }
  };
};

export const clearCart = () => {
  return async (dispatch) => {
    dispatch({ type: "CLEAR_CART_REQUEST" });
    const token = getToken();

    try {
      await DeleteCartItems(token);
      dispatch({ type: "CLEAR_CART_SUCCESS" });
      toast.success("Cart cleared");
      dispatch(getCartItems());
    } catch (err) {
      dispatch({ type: "CLEAR_CART_FAILURE", payload: err.message });
      toast.error(err.message || "Failed to clear cart");
    }
  };
};

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CART_REQUEST":
    case "UPDATE_CART_REQUEST":
    case "REMOVE_CART_REQUEST":
    case "CLEAR_CART_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_CART_SUCCESS":
      return { ...state, loading: false, cartItems: action.payload };

    case "UPDATE_CART_SUCCESS":
    case "REMOVE_CART_SUCCESS":
    case "CLEAR_CART_SUCCESS":
      return { ...state, loading: false };

    case "GET_CART_FAILURE":
    case "UPDATE_CART_FAILURE":
    case "REMOVE_CART_FAILURE":
    case "CLEAR_CART_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default cartReducer;