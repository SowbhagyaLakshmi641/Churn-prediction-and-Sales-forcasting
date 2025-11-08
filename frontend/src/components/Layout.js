import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const menuItems = [
    { path: '/churn', label: 'Churn Prediction', icon: '📊' },
    { path: '/sales', label: 'Sales Forecasting', icon: '💰' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600'} transition-colors duration-300`}>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-2xl transition-colors duration-300 z-10`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Analytics Menu</h2>
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-6">
          <div className="flex flex-col space-y-4">
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-auto">
        {React.cloneElement(children, { darkMode })}
      </div>
    </div>
  );
};

export default Layout;
