import React from "react";
import { Link } from "react-router-dom"; 
import Menucart from "./sidebar";  
import logonew from "../assets/logonew.png";  

const Navbar = () => {
  return (
    <>
      {/* Fixed Navbar */}
      <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-6 py-4 h-16">
          
          {/* Left: Hamburger Menu */}
          <div className="flex-shrink-0 w-16">
            <Menucart />
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1 px-8">
            <img
              src={logonew}
              alt="Odoo Hackathon Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

{/* Right: Cart + Profile */}
<div className="flex items-center gap-3 flex-shrink-0 justify-end">
  {/* Cart → Navigates to /Cart */}
  <Link 
    to="/cart" 
    className="relative border rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors"
  >
    🛒
  </Link>

  {/* Profile → Navigates to /profile */}
  <Link 
    to="/profile" 
    className="border rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors"
  >
    👤
  </Link>
</div>

        </div>
      </header>

      {/* Spacer to offset navbar height */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
