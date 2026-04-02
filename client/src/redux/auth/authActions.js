import { Login, Register } from "../../Api.js";
import toast from "react-hot-toast";
import { updateCookie, deleteCookie } from "../../utils/cookie.js";

const login = (formdata, navigate) => {
  return async (dispatch) => {
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const user = await Login(formdata);
      updateCookie("user", JSON.stringify(user.data), 30);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: user.data,
        message: "Login successful!",
      });
      toast.success("Login successful!");
      navigate && navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
      toast.error(err.message || "Login failed");
    }
  };
};

const register = (formdata, navigate) => {
  return async (dispatch) => {
    dispatch({ type: "REGISTER_REQUEST" });
    try {
      const user = await Register(formdata);
      updateCookie("user", JSON.stringify(user.data), 30);
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: user.data,
        message: "Registration successful!",
      });
      toast.success("Registration successful!");
      navigate && navigate("/");
    } catch (err) {
      dispatch({ type: "REGISTER_FAILURE", payload: err.message });
      toast.error(err.message || "Registration failed");
    }
  };
};

const logout = () => {
  return (dispatch) => {
    deleteCookie("user");
    dispatch({ type: "LOGOUT" });
    toast("Logged out!", { icon: "👋" });
  };
};

export { login, register, logout };
