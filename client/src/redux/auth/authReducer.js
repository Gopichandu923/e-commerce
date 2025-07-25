const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: user ? user : null,
  error: null,
  loading: false,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
      return { ...state, user: action.payload, error: null };
    case "LOGIN_ERROR":
    case "REGISTER_ERROR":
      return { ...state, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

export default authReducer;
