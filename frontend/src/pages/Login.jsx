import React, { useState } from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import { sentOtpFunction } from "../services/Apis";
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passhow, setPassShow] = useState(false);
    const [spiner, setSpiner] = useState(false);
    const [showOtpLogin, setShowOtpLogin] = useState(false); // Toggle between password and OTP login
    const navigate = useNavigate();

    // Regular password login
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        
        if (email === "") {
            toast.error("Enter Your Email!")
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email!")
        } else if (password === "") {
            toast.error("Enter Your Password!")
        } else {
            setSpiner(true);
            // Add your password login API call here
            // const response = await passwordLoginFunction({ email, password });
            
            // Temporary simulation
            setTimeout(() => {
                toast.success("Login successful!");
                setSpiner(false);
                navigate("/landingpage");
            }, 2000);
        }
    };

    // OTP login
    const sendOtp = async (e) => {
        e.preventDefault();

        if (email === "") {
            toast.error("Enter Your Email!")
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email!")
        } else {
            setSpiner(true);
            const data = { email: email };

            const response = await sentOtpFunction(data);

            if (response.status === 200) {
                setSpiner(false);
                navigate("/user/otp", { state: email });
            } else {
                toast.error(response.response.data.error);
                setSpiner(false);
            }
        }
    };

    // Handle forgot password click
    const handleForgotPassword = () => {
        setShowOtpLogin(true);
        setPassword(""); // Clear password field when switching to OTP
    };

    // Handle back to password login
    const handleBackToPasswordLogin = () => {
        setShowOtpLogin(false);
        setEmail(""); // Clear email field when going back
    };

    return (
        <>
            {/* Main Container - Full viewport centering */}
            <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#f9fafc'}}>
                <div className="w-full max-w-lg">
                    {/* Form Container */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        <div className="px-8 py-8">
                            {/* Logo Section */}
                            <div className="flex justify-center mb-8">
                                <img 
                                    src={logo} 
                                    alt="Ecofinds Logo" 
                                    className="w-32 h-32 object-contain"
                                />
                            </div>

                            {/* Page Title */}
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {showOtpLogin ? "Reset Password" : "Welcome Back"}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {showOtpLogin ? "Enter your email to receive an OTP" : "Sign in to continue your sustainable journey"}
                                </p>
                            </div>

                            {/* Back to Login Button (Only show in OTP mode) */}
                            {showOtpLogin && (
                                <div className="mb-6">
                                    <button
                                        type="button"
                                        onClick={handleBackToPasswordLogin}
                                        className="flex items-center text-green-600 hover:text-green-700 font-semibold text-sm transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                                        </svg>
                                        Back to Login
                                    </button>
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={showOtpLogin ? sendOtp : handlePasswordLogin} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Email / Username:
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-300 bg-gray-50/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 text-lg"
                                    />
                                </div>

                                {/* Password Field (Only show for password login) */}
                                {!showOtpLogin && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Password:
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={!passhow ? "password" : "text"}
                                                name="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-4 pr-16 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-300 bg-gray-50/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 text-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPassShow(!passhow)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                                            >
                                                {!passhow ? (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Forgot Password Link (Only show for password login) */}
                                {!showOtpLogin && (
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={spiner}
                                        className="w-full bg-[#5E936C] text-white py-4 px-6 rounded-2xl font-bold text-lg hover:bg-[#4C7A58] focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                                    >
                                        {spiner ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                {showOtpLogin ? "Sending OTP..." : "Signing in..."}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                {showOtpLogin ? "Send OTP" : "Login"}
                                            </div>
                                        )}
                                    </button>
                                </div>

                                {/* Sign Up Link (Only show for password login) */}
                                {!showOtpLogin && (
                                    <div className="text-center pt-6">
                                        <p className="text-gray-600 text-base">
                                            Don't have an account?{' '}
                                            <NavLink 
                                                to="/register" 
                                                className="text-green-600 hover:text-green-700 font-bold transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-green-700"
                                            >
                                                Sign up
                                            </NavLink>
                                        </p>
                                    </div>
                                )}
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
                toastClassName="rounded-2xl"
            />
        </>
    )
}

export default Login