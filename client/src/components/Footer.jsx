import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between py-6 md:flex-row">
          <div className="footer-info">
            <p className="text-center text-gray-700 dark:text-gray-300 text-sm md:text-base">
              © {new Date().getFullYear()} MyShop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
