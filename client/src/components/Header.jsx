import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaBoxOpen,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Header = () => {
  const navItems = [
    { to: "/", text: "Home", icon: <FaHome /> },
    { to: "/products", text: "Products", icon: <FaBox /> },
    { to: "/cart", text: "Cart", icon: <FaShoppingCart /> },
    { to: "/orders", text: "Orders", icon: <FaBoxOpen /> },
    { to: "/profile", text: "Profile", icon: <FaUser /> },
    { to: "/login", text: "Login", icon: <FaSignInAlt /> },
    { to: "/register", text: "Register", icon: <FaUserPlus /> },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>MyShop</h1>
        </div>
        <nav className="header-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === "/"}>
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
