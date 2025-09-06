import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import { registerfunction } from "../services/Apis";
import logo from '../assets/logo.png';

const Register = () => {
    const [passhow, setPassShow] = useState(false);
    const [confirmPassShow, setConfirmPassShow] = useState(false);
    const [spiner, setSpiner] = useState(false);
    const [inputdata, setInputdata] = useState({
        username: "",
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: ""
    });
    const navigate = useNavigate();

    // setinputvalue
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputdata({ ...inputdata, [name]: value })
    }

    // register data
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, full_name, email, password, confirmPassword, phone, address } = inputdata;

        if (username === "") {
            toast.error("Enter Your Username")
        } else if (full_name === "") {
            toast.error("Enter Your Full Name")
        } else if (email === "") {
            toast.error("Enter Your Email")
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email")
        } else if (password === "") {
            toast.error("Enter Your Password")
        } else if (password.length < 6) {
            toast.error("Password length minimum 6 characters")
        } else if (confirmPassword === "") {
            toast.error("Confirm Your Password")
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match")
        } else {
            setSpiner(true);
            
            try {
                // Prepare data for backend
                const registerData = {
                    username,
                    full_name,
                    email,
                    password,
                    phone: phone || "",
                    address: address || ""
                };

                const response = await registerfunction(registerData);

                if (response.data && response.data.success) {
                    // Store token and user data
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                    
                    setInputdata({ 
                        username: "", 
                        full_name: "", 
                        email: "", 
                        password: "", 
                        confirmPassword: "",
                        phone: "",
                        address: ""
                    });
                    setSpiner(false);
                    toast.success("Registration successful!");
                    navigate("/");
                } else {
                    toast.error(response.data?.message || "Registration failed!");
                    setSpiner(false);
                }
            } catch (error) {
                console.error('Registration error:', error);
                toast.error(error.response?.data?.message || "Registration failed!");
                setSpiner(false);
            }
        }
    }

    return (
        <>
            {/* Main Container - Full viewport centering */}
            <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#f9fafc'}}>
                <div className="w-full max-w-sm mx-auto">
                    {/* Form Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-8">
                            {/* Logo Section */}
                            <div className="flex justify-center mb-6">
                                <img 
                                    src={logo} 
                                    alt="Ecofinds Logo" 
                                    className="w-20 h-20 object-contain"
                                />
                            </div>

                            {/* Page Title */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
                                <p className="text-gray-500 text-sm">Join EcoFinds and start your sustainable journey</p>
                            </div>

                            {/* Registration Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Username Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Username:
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={inputdata.username}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    />
                                </div>

                                {/* Full Name Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Full Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        placeholder="Enter your full name"
                                        value={inputdata.full_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={inputdata.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Phone (Optional):
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={inputdata.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                    />
                                </div>

                                {/* Address Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Address (Optional):
                                    </label>
                                    <textarea
                                        name="address"
                                        placeholder="Enter your address"
                                        value={inputdata.address}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Password:
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={!passhow ? "password" : "text"}
                                            name="password"
                                            placeholder="Create a strong password"
                                            value={inputdata.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPassShow(!passhow)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-600 rounded flex items-center justify-center text-white hover:bg-gray-500 focus:outline-none transition-all duration-200"
                                        >
                                            {!passhow ? (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Confirm Password:
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={!confirmPassShow ? "password" : "text"}
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={inputdata.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setConfirmPassShow(!confirmPassShow)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-600 rounded flex items-center justify-center text-white hover:bg-gray-500 focus:outline-none transition-all duration-200"
                                        >
                                            {!confirmPassShow ? (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={spiner}
                                        className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    >
                                        {spiner ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Creating Account...
                                            </div>
                                        ) : (
                                            "Sign up"
                                        )}
                                    </button>
                                </div>

                                {/* Login Link */}
                                <div className="text-center pt-3">
                                    <p className="text-gray-600 text-sm">
                                        Already have an account?{' '}
                                        <NavLink 
                                            to="/login" 
                                            className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 underline decoration-1 underline-offset-2"
                                        >
                                            Log in
                                        </NavLink>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="z-50"
                toastClassName="rounded-lg"
            />
        </>
    )
}

export default Register