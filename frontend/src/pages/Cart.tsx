import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    image_url: string;
    condition: string;
    is_available: boolean;
    seller_id: number;
    category_id: number;
  };
}

interface CartResponse {
  cart_id: number;
  items: CartItem[];
  total_amount: number;
  item_count: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Mock data for demonstration
  const mockCartItems: CartItem[] = [
    {
      id: 1,
      cart_id: 1,
      product_id: 101,
      quantity: 2,
      added_at: '2024-01-15T10:30:00Z',
      product: {
        id: 101,
        title: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 2999.00,
        image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop&crop=center',
        condition: 'New',
        is_available: true,
        seller_id: 1,
        category_id: 1
      }
    },
    {
      id: 2,
      cart_id: 1,
      product_id: 102,
      quantity: 1,
      added_at: '2024-01-15T11:15:00Z',
      product: {
        id: 102,
        title: 'Smart Watch Series 8',
        description: 'Latest smartwatch with health monitoring features',
        price: 15999.00,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center',
        condition: 'New',
        is_available: true,
        seller_id: 2,
        category_id: 2
      }
    },
    {
      id: 3,
      cart_id: 1,
      product_id: 103,
      quantity: 1,
      added_at: '2024-01-15T12:00:00Z',
      product: {
        id: 103,
        title: 'Vintage Camera',
        description: 'Classic film camera in excellent condition',
        price: 8500.00,
        image_url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=200&fit=crop&crop=center',
        condition: 'Used - Excellent',
        is_available: false,
        seller_id: 3,
        category_id: 3
      }
    }
  ];

  // Simulate authentication
  useEffect(() => {
    // Simulate getting user ID
    const mockUserId = 123;
    setUserId(mockUserId);
  }, []);

  // Fetch cart data when userId is available
  useEffect(() => {
    if (userId) {
      fetchCartData(userId);
    }
  }, [userId]);

  const fetchCartData = async (userIdParam: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an actual API call
      // const response = await fetch(`/api/cart/${userIdParam}`, {...});
      
      // For demo, use mock data
      setCartItems(mockCartItems);
      setCartId(1);
      calculateTotal(mockCartItems);
      
    } catch (err) {
      console.error('Cart fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');
      setCartItems([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      // Optimistic update
      const updatedItems = cartItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app:
      // const response = await fetch(`/api/cart/items/${cartItemId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ quantity: newQuantity }),
      // });

    } catch (err) {
      console.error('Update quantity error:', err);
      // Revert on error
      fetchCartData(userId!);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      // Optimistic update
      const filteredItems = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(filteredItems);
      calculateTotal(filteredItems);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real app:
      // const response = await fetch(`/api/cart/items/${cartItemId}`, {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' }
      // });

    } catch (err) {
      console.error('Remove item error:', err);
      // Revert on error
      fetchCartData(userId!);
      setError('Failed to remove item. Please try again.');
    }
  };

  const handleCheckout = async () => {
    if (!userId || cartItems.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Simulate checkout API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app:
      // const response = await fetch('/api/orders/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     user_id: userId,
      //     cart_id: cartId,
      //     items: cartItems.map(item => ({
      //       product_id: item.product_id,
      //       quantity: item.quantity,
      //       price_at_purchase: item.product.price
      //     }))
      //   }),
      // });

      const orderId = Math.floor(Math.random() * 10000);
      alert(`Order created successfully! Order ID: ${orderId}`);
      
      // Clear cart after successful checkout
      setCartItems([]);
      setTotalAmount(0);
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Error: {error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm underline mt-1 hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-500" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button 
              onClick={() => {
                // Simulate adding items back for demo
                setCartItems(mockCartItems);
                calculateTotal(mockCartItems);
              }}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Add Demo Items
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-300 rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-lg border border-gray-600 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yNSAzNUgxNVYyNUgyNVYzNVoiIGZpbGw9IiM2QjczODAiLz4KPHA+bnRoIGQ9Ik02NSA1NUg1NVY0NUg2NVY1NVoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                          }}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{item.product.title}</h3>
                        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{item.product.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {item.product.condition}
                          </span>
                          {!item.product.is_available && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-green-600">₹{item.product.price.toFixed(2)}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!item.product.is_available}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold bg-gray-100 py-1 rounded">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!item.product.is_available}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions and Subtotal */}
                    <div className="flex flex-col items-end space-y-4 ml-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-lg font-bold text-green-600">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xl font-semibold">Total Amount:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                </div>
                <span className="text-3xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || cartItems.some(item => !item.product.is_available) || isCheckingOut}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : cartItems.some(item => !item.product.is_available) ? (
                  <span>Some items unavailable</span>
                ) : (
                  <span>Proceed to Checkout</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;