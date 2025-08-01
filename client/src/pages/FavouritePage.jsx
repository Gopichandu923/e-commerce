import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFavourites,
  removeFromFavourites,
} from "../redux/favourites/favouriteActions";

const FavoriteComponent = () => {
  const dispatch = useDispatch();

  const { favourite, loading, error } = useSelector(
    (state) => state.favourites
  );

  useEffect(() => {
    dispatch(getFavourites());
  }, [dispatch]);

  const handleRemoveFavorite = (id) => {
    dispatch(removeFromFavourites(id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 pb-3 mb-6 border-b border-gray-200">
        Your Favorite Products
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></div>
        </div>
      ) : favourite.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No favorite products yet.</p>
          <p className="text-sm mt-2">Your favorite items will appear here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favourite.map((product) => (
            <div
              key={product._id || product.id || product.name}
              className="border rounded-lg p-4 bg-white shadow-sm relative"
            >
              <div className="relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-500">
                    No Image
                  </div>
                )}

                <button
                  onClick={() => handleRemoveFavorite(product._id)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100 transition"
                  aria-label="Remove from favourites"
                >
                  ❌
                </button>
              </div>

              <div className="mt-3 text-center font-semibold text-gray-800">
                {product.name || "Unnamed Product"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteComponent;
