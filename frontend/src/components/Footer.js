import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <p>© {new Date().getFullYear()} MyShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
