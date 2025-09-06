import React from "react";
import Menucart from "./sidebar";  
import logonew from "../assets/logonew.png";  

const Navbar = () => {
  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-6 py-4 h-16">
        
        {/* Left: Hamburger Menu */}
        <div className="flex-shrink-0 w-16">
          <Menucart />
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-center flex-1 px-8">
          <img src={logonew} alt="Odoo Hackathon Logo" className="w-28 h-auto max-h-12" />
        </div>

        {/* Right: Cart + Profile */}
<div className="flex items-center gap-3 flex-shrink-0 justify-end">
  {/* Cart */}
  <button className="relative border rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors">
    🛒
  </button>

  {/* Profile */}
  <button className="border rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-200 transition-colors">
    👤
  </button>
</div>
      </div>
    </header>
  );
};

export default Navbar;