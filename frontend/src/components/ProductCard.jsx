import React, { useState } from 'react';

const ProductCard = ({ product, onProductClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle product click - navigate to product detail page
  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    } else {
      // Default behavior - you can customize this based on your routing setup
      window.location.href = `/product/${product.id}`;
    }
  };

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking favorite
    setIsFavorited(!isFavorited);
    // TODO: Add API call to update favorites
    console.log('Favorite toggled for product:', product.id);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    // TODO: Add API call to add to cart
    console.log('Added to cart:', product.id);
    
    // You can add your cart API call here
    // Example:
    // try {
    //   await fetch('/api/cart', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ productId: product.id, quantity: 1 })
    //   });
    // } catch (error) {
    //   console.error('Error adding to cart:', error);
    // }
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get condition color styling
  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Format price to Indian currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Truncate text to specified length
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Return null if no product data
  if (!product) {
    return null;
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {!imageError ? (
          <img
            src={product.image_url || '/api/placeholder/300/240'}
            alt={product.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-500">Image not available</span>
            </div>
          </div>
        )}
        
        {/* Overlay for sold out items */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getConditionColor(product.condition)}`}>
            {product.condition || 'Good'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 shadow-md hover:scale-110 ${
            isFavorited 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50'
          }`}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick View Button - Shows on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered && product.is_available ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <span className="text-white text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
            Click to view details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {(product.category || product.category_name) && (
          <span className="text-xs text-green-600 font-medium uppercase tracking-wide">
            {product.category?.name || product.category_name || product.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-gray-800 font-semibold mt-1 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200 leading-tight">
          {truncateText(product.title, 60)}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {truncateText(product.description, 80)}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              {formatPrice(product.price)}
            </span>
            {/* You can add original price here if you have it in your schema */}
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Seller Info */}
        {(product.seller || product.seller_name) && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">
              by {product.seller?.name || product.seller?.username || product.seller_name || 'Seller'}
            </span>
          </div>
        )}

        {/* Created Date */}
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Listed {formatDate(product.created_at)}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.is_available}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            product.is_available
              ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 hover:shadow-md transform active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={product.is_available ? 'Add to cart' : 'Product not available'}
        >
          {product.is_available ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10v6a1 1 0 001 1h1m0 0a1 1 0 001-1v-6m-2 0a1 1 0 011-1h0a1 1 0 011 1v6a1 1 0 01-1 1m-6 0a1 1 0 001 1h1a1 1 0 001-1v-6m-2 0h2" />
              </svg>
              Add to Cart
            </div>
          ) : (
            'Unavailable'
          )}
        </button>
      </div>
    </div>
  );
};

// ProductGrid component to display multiple products
const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null, 
  onProductClick,
  emptyMessage = "No products found",
  emptySubMessage = "Try adjusting your search or filters"
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-3 bg-gray-300 rounded mb-2 w-20"></div>
              <div className="h-5 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded mb-3 w-24"></div>
              <div className="h-4 bg-gray-300 rounded mb-3 w-32"></div>
              <div className="h-4 bg-gray-300 rounded mb-3 w-20"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-red-400">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-red-500 text-lg font-semibold mb-2">Error loading products</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <div className="text-gray-500 text-lg font-semibold mb-2">{emptyMessage}</div>
        <p className="text-gray-400">{emptySubMessage}</p>
      </div>
    );
  }

  // Products grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-3 bg-gray-300 rounded mb-2 w-20"></div>
      <div className="h-5 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
      <div className="h-6 bg-gray-300 rounded mb-3 w-24"></div>
      <div className="h-4 bg-gray-300 rounded mb-3 w-32"></div>
      <div className="h-4 bg-gray-300 rounded mb-3 w-20"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  </div>
);

export default ProductCard;
export { ProductGrid, ProductCardSkeleton };