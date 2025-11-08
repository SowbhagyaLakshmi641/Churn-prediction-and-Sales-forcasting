import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { apiFetch } from '../utils/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [salesData, setSalesData] = useState(null);
  const [churnData, setChurnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [salesRes, churnRes] = await Promise.all([
          apiFetch('/api/sales'),
          apiFetch('/api/churn')
        ]);
        setSalesData(salesRes);
        setChurnData(churnRes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600'} flex items-center justify-center`}>
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const totalRevenue = salesData ? salesData.salesByCategory.reduce((sum, cat) => sum + cat.revenue, 0) : 0;
  const overallChurnRate = churnData ? churnData.segmentation.reduce((sum, seg) => sum + (seg.value * seg.churnRate || 0), 0) / 100 : 0; // Approximate
  const ageDistData = salesData ? salesData.ageDistribution.map(d => ({ name: d.age_group, value: d.count })) : [];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-center flex-1">E-Commerce Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className={`p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-2">Overall Churn Rate</h3>
            <p className="text-3xl font-bold text-red-600">{overallChurnRate.toFixed(2)}%</p>
          </div>
          <div className={`p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-2">Active Customers</h3>
            <p className="text-3xl font-bold text-blue-600">{salesData ? salesData.customerSegments.reduce((sum, seg) => sum + seg.count, 0) : 0}</p>
          </div>
        </div>

        {/* Age Distribution Pie Chart */}
        <div className={`p-6 rounded-2xl shadow-2xl mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-2xl font-semibold mb-4">Customer Age Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={ageDistData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                dataKey="value"
              >
                {ageDistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8">
          <h2 className="text-3xl font-semibold text-center mb-4">Choose Detailed Analytics</h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
            <button
              onClick={() => navigate('/churn')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
            >
              Churn Prediction
            </button>
            <button
              onClick={() => navigate('/sales')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Sales Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
