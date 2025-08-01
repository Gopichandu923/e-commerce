const initialState = {
  favourite: [],
  loading: false,
  error: null,
};

const favouriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_FAVOURITES_REQUEST":
      return { ...state, loading: true, error: null };

    case "GET_FAVOURITES_SUCCESS":
      return { ...state, loading: false, favourite: action.payload };

    case "GET_FAVOURITES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "SET_FAVOURITES":
      return { ...state, favourite: action.payload };

    default:
      return state;
  }
};

export default favouriteReducer;
