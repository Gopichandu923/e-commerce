import { Login, Register } from "../../Api.js";
import toast from "react-hot-toast";

const login = (formdata, navigate) => {
  return async (dispatch) => {
    try {
      const user = await Login(formdata);
      localStorage.setItem("user", JSON.stringify(user.data));
      dispatch({ type: "LOGIN", payload: user.data });
      toast.success("Login successful!");
      navigate && navigate("/"); // optional redirection
    } catch (err) {
      console.error("Login error:", err.message);
      dispatch({ type: "LOGIN_ERROR", payload: err.message });
      toast.error(err.message || "Login failed");
    }
  };
};

const register = (formdata, navigate) => {
  return async (dispatch) => {
    try {
      const user = await Register(formdata);
      localStorage.setItem("user", JSON.stringify(user.data));
      dispatch({ type: "REGISTER", payload: user.data });
      toast.success("Registration successful!");
      navigate && navigate("/");
    } catch (err) {
      console.error("Register error:", err.message);
      dispatch({ type: "REGISTER_ERROR", payload: err.message });
      toast.error(err.message || "Registration failed");
    }
  };
};

const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    toast("Logged out!", { icon: "👋" });
  };
};

export { login, register, logout };
