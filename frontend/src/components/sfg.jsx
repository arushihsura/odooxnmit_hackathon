import React, { useState } from 'react';

const FilterSection = () => {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {/* Sort Button */}
      <div className="relative">
        <button
          onClick={() => setActiveFilter(activeFilter === 'sort' ? null : 'sort')}
          className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'sort'
              ? 'bg-green-700 text-white border-green-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          Sort
        </button>
        
        {/* Sort Dropdown */}
        {activeFilter === 'sort' && (
          <div className="absolute top-full mt-2 left-0 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 z-20 min-w-40">
            <div className="space-y-2">
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Price: Low to High</button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Price: High to Low</button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Newest First</button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Most Popular</button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => setActiveFilter(activeFilter === 'filter' ? null : 'filter')}
          className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'filter'
              ? 'bg-green-700 text-white border-green-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          Filter
        </button>
        
        {/* Filter Dropdown */}
        {activeFilter === 'filter' && (
          <div className="absolute top-full mt-2 left-0 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 z-20 min-w-48">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Category</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Electronics
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Clothing
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Books
                  </label>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    Under 500
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    500 - 1000
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    Over 1000
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Group by Button */}
      <div className="relative">
        <button
          onClick={() => setActiveFilter(activeFilter === 'groupby' ? null : 'groupby')}
          className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'groupby'
              ? 'bg-green-700 text-white border-green-500'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          Group by
        </button>
        
        {/* Group by Dropdown */}
        {activeFilter === 'groupby' && (
          <div className="absolute top-full mt-2 left-0 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-3 z-20 min-w-40">
            <div className="space-y-2">
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Condition</button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Price Range</button>
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Availability</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;