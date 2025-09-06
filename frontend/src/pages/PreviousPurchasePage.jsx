import React, { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import FilterSection from '../components/sfg'; 

const ProductCard = ({ orderItem, onBuyAgain, onViewDetails }) => {
  const { product, quantity, price_at_purchase, order } = orderItem;
  const defaultImage = 'https://via.placeholder.com/128x128?text=No+Image';
  
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all duration-200">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <img 
            src={product?.image_url || defaultImage} 
            alt={product?.title || 'Product'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {product?.title || 'Product Title'}
          </h3>
          <div className="flex items-center gap-4 mb-2">
            <p className="text-xl font-bold text-green-600">
              ₹{price_at_purchase || '0'}
            </p>
            {quantity > 1 && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Qty: {quantity}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-1">
            Category: {product?.category?.name || 'N/A'}
          </p>
          <p className="text-gray-600 mb-1">
            Seller: {product?.seller?.username || product?.seller?.full_name || 'Unknown'}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Purchased on: {order?.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'N/A'}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => onBuyAgain && onBuyAgain(product)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                product?.is_available === false 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              disabled={product?.is_available === false}
            >
              {product?.is_available === false ? 'Not Available' : 'Buy Again'}
            </button>
            <button 
              onClick={() => onViewDetails && onViewDetails(product)}
              className="border-2 border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviousPurchasePage = ({ 
  orderItems, 
  onBuyAgain,
  onViewDetails,
  onSearch,
  loading,
  onLoadMore,
  hasMoreItems,
  emptyStateConfig
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const defaultEmptyState = {
    title: 'No previous purchases',
    message: 'Start shopping to see your purchase history here',
    searchTitle: 'No matching purchases found',
    searchMessage: 'Try adjusting your search terms'
  };

  const emptyState = { ...defaultEmptyState, ...emptyStateConfig };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-800">Previous Purchase</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pt-24">
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your previous purchases..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-green-500 focus:outline-none transition-colors"
          />
        </div>

        {/* ✅ Filter Section from sgf.jsx */}
        <FilterSection />

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-600 mt-4">Loading your purchases...</p>
          </div>
        ) : !orderItems || orderItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? emptyState.searchTitle : emptyState.title}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? emptyState.searchMessage : emptyState.message}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderItems.map((orderItem, index) => (
              <ProductCard 
                key={`${orderItem?.order?.id || index}-${orderItem?.product?.id || index}`}
                orderItem={orderItem} 
                onBuyAgain={onBuyAgain}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMoreItems && !loading && orderItems && orderItems.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={onLoadMore}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Load More Products
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviousPurchasePage;
