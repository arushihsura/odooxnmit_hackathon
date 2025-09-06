import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import FilterSection from "../components/sfg";  
import SlidingBanner from "../components/bannerimage";
import ProductCard, { ProductGrid } from "../components/ProductCard";

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API endpoint
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled by useEffect above
  };

  // Handle product click - navigate to product detail page
  const handleProductClick = (productId) => {
    // You can customize this based on your routing setup
    // For React Router: navigate(`/product/${productId}`);
    // For Next.js: router.push(`/product/${productId}`);
    // For simple routing:
    window.location.href = `/product/${productId}`;
  };

  // Handle filter changes (you can expand this based on your FilterSection component)
  const handleFilterChange = (filters) => {
    // Apply filters to products
    let filtered = products;

    // Example filter logic - customize based on your needs
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.name?.toLowerCase() === filters.category.toLowerCase() ||
        product.category_name?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.condition && filters.condition !== 'all') {
      filtered = filtered.filter(product => 
        product.condition?.toLowerCase() === filters.condition.toLowerCase()
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && 
        product.price <= filters.priceRange.max
      );
    }

    if (filters.availability === 'available') {
      filtered = filtered.filter(product => product.is_available);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="pt-20 px-12 max-w-6xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <input
            type="text"
            placeholder="Search for eco-friendly products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg shadow-sm 
                       focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 
                       transition-all duration-200 text-gray-700 placeholder-gray-400"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-green-600 transition-colors"
          >
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
          </button>
        </form>

        {/* Filter Section */}
        <FilterSection onFilterChange={handleFilterChange} />

        {/* Sliding Banner */}
        <SlidingBanner />

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              {loading ? 'Searching...' : `Search results for "${searchQuery}"`}
            </h2>
            {!loading && (
              <p className="text-sm text-gray-600 mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        )}

        {/* Products Section */}
        <section className="mt-8">
          {!searchQuery && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Discover unique, pre-loved treasures that save your money and the planet
              </p>
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid 
            products={filteredProducts}
            loading={loading}
            error={error}
            onProductClick={handleProductClick}
            emptyMessage={searchQuery ? "No products found for your search" : "No products available"}
            emptySubMessage={searchQuery ? "Try different keywords or check your spelling" : "Check back later for new products"}
          />
        </section>

        {/* Additional Content Sections */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            {/* Categories Section */}
            <section className="mt-16 mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Shop by Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* You can add category cards here */}
                <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Electronics</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Fashion</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Home & Garden</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Books</span>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="mt-16 mb-12 bg-green-50 rounded-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Our Impact
                </h3>
                <p className="text-gray-600">
                  Together, we're making a difference for our planet
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                  <div className="text-sm text-gray-600">Products Rehomed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">2 Tons</div>
                  <div className="text-sm text-gray-600">Waste Reduced</div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default LandingPage;