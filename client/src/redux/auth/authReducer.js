const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: user || null,
  loading: false,
  error: null,
  successMessage: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "REGISTER_REQUEST":
    case "LOGIN_REQUEST":
      return { ...state, loading: true, error: null, successMessage: null };

    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
        successMessage: action.message || null,
      };

    case "REGISTER_FAILURE":
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        successMessage: null,
      };

    default:
      return state;
  }
}

export default authReducer;
