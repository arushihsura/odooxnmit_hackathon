import React, { useState } from "react";

const Menucart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-4 z-50 flex flex-col justify-center items-center w-10 h-10 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
          isOpen ? "left-5" : "left-4"
        }`}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {/* Always show hamburger icon */}
        <div className="flex flex-col space-y-1">
          <div className="w-5 h-0.5 bg-gray-800"></div>
          <div className="w-5 h-0.5 bg-gray-800"></div>
          <div className="w-5 h-0.5 bg-gray-800"></div>
        </div>
      </button>

      {/* Sidebar (Slide-in from left) */}
      <div
      className={`fixed top-0 left-0 h-full w-auto bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      >
       <div className="p-4 pt-16 w-48"> {/* optional width control */}
          <nav className="space-y-2">
      <a href="#" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200">
        Profile
      </a>
      <a href="#" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200">
        My Listing
      </a>
      <a href="#" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200">
        My Products
      </a>
      <a href="#" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200">
        My Purchases
      </a>
      <a href="#" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200">
        Contact Us
      </a>
      <a href="#" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200">
        About
      </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Menucart;