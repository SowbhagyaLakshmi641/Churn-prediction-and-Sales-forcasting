import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { apiFetch } from '../utils/api';

const ChurnPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [churnData, setChurnData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchChurnData = async () => {
      try {
        const data = await apiFetch('/api/churn');
        setChurnData(data);
        if (data && data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0]);
        }
      } catch (error) {
        console.error('Error fetching churn data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChurnData();
  }, [navigate]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading churn data...</div>;
  }

  if (!churnData) {
    return <div className="container mx-auto px-4 py-8">Error loading churn data.</div>;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-2`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow p-3 mb-3 transition-all duration-500 hover:shadow-xl ${darkMode ? 'bg-gradient-to-r from-purple-800 to-teal-800' : 'bg-gradient-to-r from-purple-500 to-teal-600'} text-white`}>
          <h1 className="text-xl font-bold text-center animate-pulse">Churn Prediction Analytics Dashboard</h1>
        </div>

        {/* Top Customers and Trends */}
        <div className={`rounded-lg shadow p-3 mb-3 transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-semibold mb-2 text-center">High-Risk Customers & Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h3 className="text-sm font-medium mb-1">Top 10 Customers Most Likely to Churn</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-xs">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <th className="px-1 py-1 text-left">Customer ID</th>
                      <th className="px-1 py-1 text-left">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {churnData.topCustomers.map((customer, index) => (
                      <tr key={customer.id} className={`${index % 2 === 0 ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''} hover:bg-opacity-50 transition-colors duration-200`}>
                        <td className="px-1 py-1">{customer.id}</td>
                        <td className="px-1 py-1">{customer.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Churn Rate Trends</h3>
              <ResponsiveContainer width="90%" height={300}>
                <LineChart data={churnData.churnTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                  <YAxis fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="churnRate" stroke="#06b6d4" strokeWidth={2} name="Churn Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Churn Rates by Category and Segmentation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className={`rounded-lg shadow p-3 transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold mb-2 text-center">Churn Rates by Category</h2>
            <div className="mb-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {churnData.categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 py-1 text-xs rounded transition-all duration-200 hover:scale-105 ${selectedCategory === category ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'} ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'hover:bg-gray-400'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            {selectedCategory && (
              <div>
                <h3 className="text-sm font-medium mb-1 text-center">{selectedCategory.name} Churn Rates by Country</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={selectedCategory.countryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="country" fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                    <YAxis fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="churnRate" fill="#8b5cf6" barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className={`rounded-lg shadow p-3 transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold mb-2 text-center">Customer Segmentation by Churn Likelihood</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={churnData.segmentation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {churnData.segmentation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPage;
