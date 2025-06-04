import React from "react";
import { Link } from "react-router-dom";

const categoriesData = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8a2s93EJ5sRWo-csHhzUXSt4d194czTtfDA&s",
    name: "men's clothing",
    title: "Men's Clothing",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReSc4jrWW-xIj68VNdpd0m7hnFhFP6EeNt3g&s",
    name: "women's clothing",
    title: "Women's Clothing",
  },
  {
    image: "https://i.imgur.com/R3iobJA.jpeg",
    name: "clothes",
    title: "Garments",
  },
  {
    image:
      "https://www.polytechnichub.com/wp-content/uploads/2017/04/Electronic.jpg",
    title: "Electronics",
    name: "electronics",
  },
  {
    image: "https://i.imgur.com/qNOjJje.jpeg",
    title: "Shoes",
    name: "shoes",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIH2J248JrjWmiKcmReiT5WzJadUMFvJyElQ&s",
    title: "Beauty",
    name: "beauty",
  },
  {
    image:
      "https://png.pngtree.com/thumb_back/fh260/background/20241018/pngtree-eau-de-parfum-hd-8k-wallpaper-stock-photographic-image-image_16359989.jpg",
    title: "Fragrances",
    name: "fragrances",
  },
  {
    image:
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp",
    title: "Furniture",
    name: "furniture",
  },
  {
    image:
      "https://imgmediagumlet.lbb.in/media/2020/08/5f2a693104db971b346e9c2f_1596614961138.jpg",
    title: "Groceries",
    name: "groceries",
  },
  {
    image:
      "https://hips.hearstapps.com/hmg-prod/images/vintage-necklaces-and-jewelry-for-sale-in-the-royalty-free-image-1687462684.jpg",
    title: "Jewelery",
    name: "jewelery",
  },
];

const HomePage = () => {
  const HeroSection = () => (
    <div
      className="relative bg-cover bg-center text-white py-32 md:py-48 px-6 shadow-lg"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      <div className="relative container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Discover Your Next Favorite
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light max-w-2xl mx-auto text-gray-100">
          Shop the latest trends and best deals, all in one place. Unbeatable
          prices, unmatched quality.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => {
    const displayTitle = category.title;
    return (
      <Link
        to={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
        className="group flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-2 border border-gray-100"
      >
        <div className="h-48 w-full overflow-hidden">
          <img
            src={
              category.image ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={displayTitle}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {displayTitle}
          </h3>
        </div>
      </Link>
    );
  };

  const CategoryShowcase = () => (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Explore Our Collections
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {categoriesData && categoriesData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {categoriesData.map((category, index) => (
              <CategoryCard
                key={`${category.name.replace(/\s+/g, "-")}-${index}`}
                category={category}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No categories to display at the moment.
          </p>
        )}
      </div>
    </section>
  );

  const CallToAction = () => (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Don't Miss Out!</h2>
        <p className="text-xl mb-8 max-w-xl mx-auto opacity-90">
          Subscribe to our newsletter for exclusive deals, new arrivals, and
          much more.
        </p>
        <form className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow p-4 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md"
            required
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-4 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-6 text-sm opacity-80 max-w-md mx-auto">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="overflow-hidden">
        <HeroSection />
        <CategoryShowcase />
        <CallToAction />

        {/* Feature Highlights Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Products</h3>
                <p className="text-gray-600">
                  All items are carefully curated and quality-checked
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
                <p className="text-gray-600">
                  All transactions are encrypted and secure
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Get your order quickly with our efficient shipping
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
