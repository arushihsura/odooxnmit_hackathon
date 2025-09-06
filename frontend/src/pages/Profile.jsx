import React, { useState } from 'react';

const User = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [activeNav, setActiveNav] = useState('');

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add your save logic here
    console.log('Saved user data:', userData);
  };

  const handleNavigation = (section) => {
    setActiveNav(section);
    console.log(`Navigating to: ${section}`);
    // Add your navigation logic here
    // Example: navigate('/my-listings') or navigate('/my-purchases')
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">

      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              {/* Edit Button Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {isEditing ? (
                  <div className="space-x-3">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Profile Content */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 border-2 border-gray-300 rounded-full bg-gray-50 flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer mb-4">
                    <span className="text-gray-500 text-sm font-medium">Profile Photo</span>
                  </div>
                  {isEditing && (
                    <button className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      Change Photo
                    </button>
                  )}
                </div>

                {/* Profile Fields */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username:</label>
                    <input 
                      type="text" 
                      placeholder="Change your username"
                      value={userData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name:</label>
                    <input 
                      type="text" 
                      placeholder="Change your full name"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                    <input 
                      type="email" 
                      placeholder="Change your email address"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional):</label>
                    <input 
                      type="tel" 
                      placeholder="Change your phone number"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional):</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Change your address"
                        value={userData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      />
                      {isEditing && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                          <button 
                            type="button"
                            className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-teal-600 transition-colors"
                            title="Current Location"
                          >
                            📍
                          </button>
                          <button 
                            type="button"
                            className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-green-700 transition-colors"
                            title="Search Address"
                          >
                            🔍
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder="Create a strong password"
                            value={userData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-6 bg-green-600 rounded flex items-center justify-center hover:bg-green-700 transition-colors"
                            title="Toggle password visibility"
                          >
                            <span className="text-white text-xs">👁</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password:</label>
                        <div className="relative">
                          <input 
                            type="password" 
                            placeholder="Confirm your password"
                            value={userData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-6 bg-green-600 rounded flex items-center justify-center hover:bg-green-700 transition-colors"
                            title="Toggle password visibility"
                          >
                            <span className="text-white text-xs">👁</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleNavigation('listings')}
                  className={`w-full bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-left flex items-center justify-between group ${
                    activeNav === 'listings' ? 'bg-gray-50 border-gray-400 text-gray-800' : ''
                  }`}
                >
                  <span>My Listings</span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <button 
                  onClick={() => handleNavigation('purchases')}
                  className={`w-full bg-white border-2 border-green-300 text-green-700 py-4 px-6 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all duration-200 font-medium text-left flex items-center justify-between group ${
                    activeNav === 'purchases' ? 'bg-green-50 border-green-400 text-green-800' : ''
                  }`}
                >
                  <span>My Purchases</span>
                  <svg className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>


              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Profile Completion</h4>
              <p className="text-sm text-blue-700 mb-3">Complete your profile to get the most out of our platform.</p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">65% complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;