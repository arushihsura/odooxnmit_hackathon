import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative max-w-6xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center mb-8"
                    >
                        <img 
                            src={logo} 
                            alt="EcoFinds Logo" 
                            className="w-20 h-20 object-contain"
                        />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl font-bold mb-4"
                    >
                        About EcoFinds
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl opacity-90 max-w-2xl mx-auto"
                    >
                        Creating a sustainable future, one transaction at a time
                    </motion.p>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Story</h2>
                        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p>
                                **EcoFinds was born from a simple yet powerful idea: every item has more than one life to live.** In a world where fast consumption threatens our planet's future, we're creating a vibrant marketplace that makes sustainable choices not just possible, but exciting and rewarding.
                            </p>
                            <p>
                                Our journey began when we recognized that millions of perfectly good items end up in landfills simply because they've outgrown their original purpose in someone's life. We saw an opportunity to bridge the gap between those who have items to share and those seeking unique, affordable alternatives to buying new.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Vision */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                To create a vibrant and trusted platform that revolutionizes the way people buy and sell pre-owned goods. We envision a future where sustainable consumption is the norm, where every purchase extends a product's lifecycle, and where our community becomes the go-to destination for conscious consumers seeking unique treasures.
                            </p>
                        </motion.div>

                        {/* Mission */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                To develop an intuitive, engaging platform that connects buyers and sellers efficiently while promoting a circular economy. We're building more than just a marketplace – we're fostering a community that makes sustainable choices easier, more accessible, and more rewarding for everyone.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose EcoFinds Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose EcoFinds?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover the benefits of joining our sustainable marketplace community
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Environmental Impact */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Environmental Impact</h3>
                            <p className="text-gray-600 text-sm">
                                Every transaction on EcoFinds helps reduce waste, lower carbon footprints, and promote sustainable consumption patterns. When you buy pre-owned, you're directly contributing to reducing manufacturing demand and keeping items out of landfills.
                            </p>
                        </motion.div>

                        {/* Unique Treasures */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Unique Treasures</h3>
                            <p className="text-gray-600 text-sm">
                                Discover one-of-a-kind items with history and character that you simply can't find in traditional retail stores. From vintage finds to gently used modern pieces, every item has a story waiting to continue.
                            </p>
                        </motion.div>

                        {/* Trusted Community */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Trusted Community</h3>
                            <p className="text-gray-600 text-sm">
                                Join a community of like-minded individuals committed to making responsible consumption choices together. Our platform fosters connections between neighbors, friends, and fellow sustainability enthusiasts.
                            </p>
                        </motion.div>

                        {/* Seamless Experience */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Seamless Experience</h3>
                            <p className="text-gray-600 text-sm">
                                Enjoy an intuitive platform designed for both mobile and desktop, making buying and selling effortless. Our user-friendly interface ensures that sustainable shopping is as convenient as traditional retail.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-green-50">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do at EcoFinds
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Sustainability First */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    🌱
                                </span>
                                Sustainability First
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Environmental responsibility is at the core of everything we do. Every feature, partnership, and initiative is evaluated through the lens of sustainability and positive environmental impact.
                            </p>
                        </motion.div>

                        {/* Community-Driven */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    🤝
                                </span>
                                Community-Driven
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We believe in the power of community to drive meaningful change. Our platform is built by users, for users, with continuous feedback shaping our development.
                            </p>
                        </motion.div>

                        {/* Trust & Transparency */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    🔒
                                </span>
                                Trust & Transparency
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Building trust between buyers and sellers is paramount. We provide transparent processes, secure transactions, and reliable communication channels.
                            </p>
                        </motion.div>

                        {/* Innovation for Good */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                    💡
                                </span>
                                Innovation for Good
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We harness technology to make sustainable consumption more accessible, enjoyable, and rewarding than ever before.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Join the EcoFinds Community</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Ready to make a positive impact on the planet while discovering unique treasures? Start your sustainable shopping journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Start Shopping
                            </button>
                            <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-300">
                                Become a Seller
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
