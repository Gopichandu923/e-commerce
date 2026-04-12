import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ darkMode = false }) => {
  return (
    <footer className={`w-full pt-20 pb-10 ${darkMode ? "bg-[#041627]" : "bg-[#f5f3f4]"}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="mb-10 lg:mb-0">
          <span className={`text-lg font-bold font-headline ${darkMode ? "text-[#fbf9fa]" : "text-[#041627]"}`}>
            ATELIER
          </span>
          <p className={`mt-4 font-label text-xs leading-loose max-w-xs ${
            darkMode ? "text-[#fbf9fa]/50" : "text-[#041627]/50"
          }`}>
            Elevating the everyday through a curated lens of architectural precision and artisanal quality.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 lg:flex lg:gap-20">
          <div className="flex flex-col gap-4">
            <span className={`font-bold font-label text-xs tracking-widest uppercase ${
              darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
            }`}>
              Service
            </span>
            <div className={`flex flex-col gap-2 font-label text-xs tracking-widest uppercase ${
              darkMode ? "text-[#fbf9fa]/50" : "text-[#041627]/50"
            }`}>
              <Link className="hover:text-[#735c00] transition-colors duration-200" to="/shipping">Shipping &amp; Returns</Link>
              <Link className="hover:text-[#735c00] transition-colors duration-200" to="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <span className={`font-bold font-label text-xs tracking-widest uppercase ${
              darkMode ? "text-[#fbf9fa]" : "text-[#041627]"
            }`}>
              Editorial
            </span>
            <div className={`flex flex-col gap-2 font-label text-xs tracking-widest uppercase ${
              darkMode ? "text-[#fbf9fa]/50" : "text-[#041627]/50"
            }`}>
              <Link className="hover:text-[#735c00] transition-colors duration-200" to="/sustainability">Sustainability</Link>
              <Link className="hover:text-[#735c00] transition-colors duration-200" to="/journal">Journal</Link>
              <Link className="hover:text-[#735c00] transition-colors duration-200" to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto text-center lg:text-left">
        <span className={`font-label text-[10px] tracking-[0.2em] uppercase ${
          darkMode ? "text-[#fbf9fa]/50" : "text-[#041627]/50"
        }`}>
          © {new Date().getFullYear()} THE DIGITAL ATELIER. ALL RIGHTS RESERVED.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
