import React, { useState } from "react";
import { Search, ShoppingCart, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate hook
import FilterSection from "../components/sfg"; 

const ProductCard = ({ product }) => {
  const defaultImage = "https://via.placeholder.com/128x128?text=No+Image";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex gap-4 hover:border-green-300 hover:shadow-md transition-all duration-200">
      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product?.image || defaultImage}
          alt={product?.name || "Product"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product?.name || "Name of product"}
        </h3>
        <p className="text-green-600 font-medium">₹{product?.price || "0"}</p>
        <p className="text-gray-600">Category: {product?.category || "N/A"}</p>
        <p className="text-gray-600">Status: {product?.status || "N/A"}</p>
        <p className="text-gray-600">Seller: {product?.seller || "Unknown"}</p>
      </div>
    </div>
  );
};

const MyListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // ✅ use navigate

  // Mock product data
  const [products] = useState([
    {
      id: 1,
      name: "Stylish Shirt",
      price: 799,
      category: "Clothing",
      status: "Available",
      seller: "John Doe",
      image: ""
    },
    {
      id: 2,
      name: "Smartphone",
      price: 14999,
      category: "Electronics",
      status: "Out of Stock",
      seller: "Tech World",
      image: ""
    },
    {
      id: 3,
      name: "Novel - The Great Story",
      price: 399,
      category: "Books",
      status: "Available",
      seller: "Book House",
      image: ""
    }
  ]);

  // Filtered products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Add New Button */}
      <div className="px-6 mt-4">
        <button
          onClick={() => navigate("/addproduct")}  // ✅ navigate to /addproduct
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={18} />
          Add new
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:border-green-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-6 mt-4">
        <FilterSection />
      </div>

      {/* Product Listings */}
      <div className="px-6 mt-6 space-y-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {filteredProducts.length === 0 && (
          <p className="text-gray-500 text-center">No listings found.</p>
        )}
      </div>
    </div>
  );
};

export default MyListings;
