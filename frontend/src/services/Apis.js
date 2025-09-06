import { commonrequest, api } from "./ApiCall";
import { BACKEND_URL } from "./helper";

// ==================== AUTHENTICATION APIs ====================

// User Registration
export const registerfunction = async (data) => {
    return await commonrequest("POST", "/auth/register", data);
};

// User Login
export const loginFunction = async (data) => {
    return await commonrequest("POST", "/auth/login", data);
};

// Get Current User
export const getCurrentUser = async () => {
    return await commonrequest("GET", "/auth/me");
};

// Send Password Reset OTP
export const sentOtpFunction = async (data) => {
    return await commonrequest("POST", "/auth/forgot-password", data);
};

// Verify Password Reset OTP
export const verifyOtpFunction = async (data) => {
    return await commonrequest("POST", "/auth/verify-reset-otp", data);
};

// Reset Password with OTP
export const resetPasswordFunction = async (data) => {
    return await commonrequest("POST", "/auth/reset-password", data);
};

// ==================== PRODUCT APIs ====================

// Get All Products
export const getProducts = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return await commonrequest("GET", url);
};

// Get Single Product
export const getProduct = async (id) => {
    return await commonrequest("GET", `/products/${id}`);
};

// Get Categories
export const getCategories = async () => {
    return await commonrequest("GET", "/products/categories");
};

// Create Product
export const createProduct = async (productData, imageFile) => {
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category_id', productData.categoryId);
    formData.append('condition', productData.condition);
    
    if (imageFile) {
        formData.append('image', imageFile);
    }

    return await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Update Product
export const updateProduct = async (id, productData) => {
    return await commonrequest("PUT", `/products/${id}`, productData);
};

// Delete Product
export const deleteProduct = async (id) => {
    return await commonrequest("DELETE", `/products/${id}`);
};

// ==================== CART APIs ====================

// Get Cart
export const getCart = async () => {
    return await commonrequest("GET", "/cart");
};

// Add to Cart
export const addToCart = async (data) => {
    return await commonrequest("POST", "/cart/items", data);
};

// Update Cart Item
export const updateCartItem = async (itemId, data) => {
    return await commonrequest("PUT", `/cart/items/${itemId}`, data);
};

// Remove from Cart
export const removeFromCart = async (itemId) => {
    return await commonrequest("DELETE", `/cart/items/${itemId}`);
};

// Clear Cart
export const clearCart = async () => {
    return await commonrequest("DELETE", "/cart");
};

// ==================== ORDER APIs ====================

// Create Order
export const createOrder = async () => {
    return await commonrequest("POST", "/orders");
};

// Get Orders
export const getOrders = async (page = 1, limit = 20) => {
    return await commonrequest("GET", `/orders?page=${page}&limit=${limit}`);
};

// Get Single Order
export const getOrder = async (orderId) => {
    return await commonrequest("GET", `/orders/${orderId}`);
};

// ==================== USER APIs ====================

// Get User Profile
export const getUserProfile = async () => {
    return await commonrequest("GET", "/users/profile");
};

// Update User Profile
export const updateUserProfile = async (data) => {
    return await commonrequest("PUT", "/users/profile", data);
};

// Change Password
export const changePassword = async (data) => {
    return await commonrequest("PUT", "/users/change-password", data);
};

// Get User's Products
export const getUserProducts = async (page = 1, limit = 20) => {
    return await commonrequest("GET", `/users/my-products?page=${page}&limit=${limit}`);
};

// ==================== LEGACY COMPATIBILITY ====================

// Keep old function names for backward compatibility
export const userVerify = loginFunction;
