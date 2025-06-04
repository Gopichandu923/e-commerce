import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaBoxOpen,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { to: "/", text: "Home", icon: <FaHome className="text-lg" /> },
    { to: "/products", text: "Products", icon: <FaBox className="text-lg" /> },
    { to: "/cart", text: "Cart", icon: <FaShoppingCart className="text-lg" /> },
    { to: "/orders", text: "Orders", icon: <FaBoxOpen className="text-lg" /> },
    { to: "/profile", text: "Profile", icon: <FaUser className="text-lg" /> },
    { to: "/login", text: "Login", icon: <FaSignInAlt className="text-lg" /> },
    {
      to: "/register",
      text: "Register",
      icon: <FaUserPlus className="text-lg" />,
    },
  ];

  // Function to determine NavLink styling
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-700 text-white"
        : "text-gray-700 hover:bg-indigo-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              MyShop
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={getNavLinkClass}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden">
          <ul className="space-y-1 border-t border-gray-200 px-2 pb-3 pt-2 dark:border-gray-700">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={getNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
