import React from "react";
import Navbar from "../components/navbar";
import FilterSection from "../components/sfg";  
import SlidingBanner from "../components/bannerimage"; 

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="pt-20 px-12 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for eco-friendly products..."
            className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg shadow-sm 
                       focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 
                       transition-all duration-200 text-gray-700 placeholder-gray-400"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Section */}
        <FilterSection />

        {/* Sliding Banner */}
        <SlidingBanner />

        {/* Other page content can go here */}
      </main>
    </div>
  );
};

export default LandingPage;
