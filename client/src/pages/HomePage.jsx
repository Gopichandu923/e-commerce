import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const categoriesData = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8a2s93EJ5sRWo-csHhzUXSt4d194czTtfDA&s",
    name: "men's clothing",
    title: "Men's Clothing",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReSc4jrWW-xIj68VNdpd0m7hnFhFP6EeNt3g&s",
    name: "women's clothing",
    title: "Women's Clothing",
  },
  {
    image: "https://i.imgur.com/R3iobJA.jpeg",
    name: "clothes",
    title: "Garments",
  },
  {
    image: "https://www.polytechnichub.com/wp-content/uploads/2017/04/Electronic.jpg",
    title: "Electronics",
    name: "electronics",
  },
  {
    image: "https://i.imgur.com/qNOjJje.jpeg",
    title: "Shoes",
    name: "shoes",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIH2J248JrjWmiKcmReiT5WzJadUMFvJyElQ&s",
    title: "Beauty",
    name: "beauty",
  },
  {
    image: "https://png.pngtree.com/thumb_back/fh260/background/20241018/pngtree-eau-de-parfum-hd-8k-wallpaper-stock-photographic-image-image_16359989.jpg",
    title: "Fragrances",
    name: "fragrances",
  },
  {
    image: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp",
    title: "Furniture",
    name: "furniture",
  },
  {
    image: "https://imgmediagumlet.lbb.in/media/2020/08/5f2a693104db971b346e9c2f_1596614961138.jpg",
    title: "Groceries",
    name: "groceries",
  },
  {
    image: "https://hips.hearstapps.com/hmg-prod/images/vintage-necklaces-and-jewelry-for-sale-in-the-royalty-free-image-1687462684.jpg",
    title: "Jewelery",
    name: "jewelery",
  },
];

const HomePage = ({ darkMode = false }) => {
  const HeroSection = () => (
    <div
      className="relative bg-cover bg-center py-32 md:py-48"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#041627]/90 to-[#041627]/60"></div>
      <div className="relative w-full text-center px-6">
        <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase mb-4 inline-block text-white">
          Private Selection
        </span>
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold mb-6 leading-tight tracking-tighter text-white">
          The Editorial Edit
        </h1>
        <p className="text-lg md:text-xl mb-10 font-body mx-auto text-white/80 max-w-2xl">
          Discover curated pieces that elevate the everyday through architectural precision and artisanal quality.
        </p>
        <Link
          to="/shop"
          className="inline-block btn-gradient text-white font-label text-sm tracking-widest uppercase py-4 px-10 rounded-lg hover:opacity-90 transition-opacity"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => {
    const displayTitle = category.title;
    return (
      <Link
        to={`/shop?category=${encodeURIComponent(category.name.toLowerCase())}`}
        className="group flex flex-col"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f5f3f4]">
          <img
            src={
              category.image ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-headline font-bold text-lg tracking-tight text-[#041627] dark:text-[#fbf9fa] group-hover:text-secondary transition-colors duration-300">
            {displayTitle}
          </h3>
        </div>
      </Link>
    );
  };

  const CategoryShowcase = () => (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
            Curated Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-[#041627] dark:text-[#fbf9fa] mt-4 tracking-tight">
            Shop by Category
          </h2>
        </div>

        {categoriesData && categoriesData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
            {categoriesData.map((category, index) => (
              <CategoryCard
                key={`${category.name.replace(/\s+/g, "-")}-${index}`}
                category={category}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#44474c] text-lg font-body">
            No categories to display at the moment.
          </p>
        )}
      </div>
    </section>
  );

  const CallToAction = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e) => {
      e.preventDefault();
      if (!email.trim()) return;
      
      setLoading(true);
      try {
        await fetch("http://localhost:4040/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setSubscribed(true);
        setEmail("");
      } catch (err) {
        console.error("Newsletter error:", err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <section className="bg-[#041627] py-20">
        <div className="w-full px-6 md:px-12 lg:px-24 text-center max-w-3xl">
          <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
            Newsletter
          </span>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mt-4 mb-6">
            Subscribe to ShopEase
          </h2>
          <p className="text-white/60 font-body mb-8 mx-auto max-w-xl">
            Get the latest updates on new products, special offers, and exclusive deals. Join thousands of happy shoppers!
          </p>
          {subscribed ? (
            <div className="bg-green-500/20 text-green-400 py-3 px-6 rounded-lg max-w-md mx-auto">
              ✓ Thanks for subscribing! Check your inbox for a welcome gift.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-grow py-3 px-4 rounded-lg bg-[#1a2b3c] text-white border border-[#1a2b3c] focus:border-secondary focus:outline-none font-body placeholder-white/40"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient px-8 py-3 rounded-lg text-white font-label text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          <p className="mt-6 text-xs text-white/40 font-label">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    );
  };

  const FeatureHighlights = () => (
    <section className="py-24 bg-[#f5f3f4]">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-[#041627]">
                favorite
              </span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-3 text-[#041627]">Curated Selection</h3>
            <p className="text-[#44474c] font-body">
              Each piece is carefully selected for quality and design
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-[#041627]">
                lock
              </span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-3 text-[#041627]">Secure Checkout</h3>
            <p className="text-[#44474c] font-body">
              Encrypted transactions protect your data
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-[#041627]">
                local_shipping
              </span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-3 text-[#041627]">White Glove Delivery</h3>
            <p className="text-[#44474c] font-body">
              Complimentary shipping on all orders
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-surface">
      <main className="overflow-hidden">
        <HeroSection />
        <CategoryShowcase />
        <FeatureHighlights />
        <CallToAction />
      </main>
    </div>
  );
};

export default HomePage;