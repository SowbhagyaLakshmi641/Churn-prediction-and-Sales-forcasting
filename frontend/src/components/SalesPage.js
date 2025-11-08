import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { apiFetch } from '../utils/api';

const SalesPage = ({ darkMode }) => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSalesData = async () => {
      try {
        const data = await apiFetch('/api/sales');
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [navigate]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading sales data...</div>;
  }

  if (!salesData) {
    return <div className="container mx-auto px-4 py-8">Error loading sales data.</div>;
  }

  // Prepare revenue trends data
  const allTrends = salesData.revenueTrends.map(trend => ({
    month: trend.month,
    sales: trend.revenue,
  }));

  const firstGraphData = allTrends.filter(trend => trend.month <= '2025-09');
  const secondGraphData = allTrends.filter(trend => trend.month >= '2025-10');

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      } p-2`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`rounded-lg shadow p-3 mb-3 ${
            darkMode
              ? 'bg-gradient-to-r from-blue-800 to-purple-800'
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          } text-white`}
        >
          <h1 className="text-xl font-bold text-center mb-2">
            Sales Analytics Dashboard
          </h1>
          <div className="text-center">
            <p className="text-sm">Total Revenue</p>
            <p className="text-2xl font-bold">
              $
              {salesData.salesByCategory
                .reduce((sum, cat) => sum + cat.revenue, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Revenue Trends (moved left side, full width on small, half on large) */}
        <div
          className={`rounded-lg shadow p-3 mb-3 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className="text-lg font-semibold mb-2 text-center">
            Revenue Trends
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h3 className="text-sm font-medium mb-1">
                Historical (2020-07 to 2025-09)
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={firstGraphData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? '#374151' : '#e5e7eb'}
                  />
                  <XAxis
                    dataKey="month"
                    type="category"
                    fontSize={10}
                    stroke={darkMode ? '#d1d5db' : '#374151'}
                  />
                  <YAxis fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                  <Tooltip
                    formatter={value => [`$${value}`, 'Revenue']}
                    labelFormatter={label => `${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">
                Predicted (2025-10 to 2026-12)
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={secondGraphData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? '#374151' : '#e5e7eb'}
                  />
                  <XAxis
                    dataKey="month"
                    type="category"
                    fontSize={10}
                    stroke={darkMode ? '#d1d5db' : '#374151'}
                  />
                  <YAxis fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                  <Tooltip
                    formatter={value => [`$${value}`, 'Revenue']}
                    labelFormatter={label => `${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales by Category + Age Distribution side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Sales by Category */}
          <div
            className={`rounded-lg shadow p-3 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className="text-lg font-semibold mb-2 text-center">
              Sales by Category
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesData.salesByCategory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? '#374151' : '#e5e7eb'}
                />
                <XAxis
                  dataKey="category"
                  fontSize={10}
                  stroke={darkMode ? '#d1d5db' : '#374151'}
                />
                <YAxis fontSize={10} stroke={darkMode ? '#d1d5db' : '#374151'} />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age Distribution as Table */}
          <div
            className={`rounded-lg shadow p-3 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className="text-lg font-semibold mb-2 text-center">
              Age Distribution
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead
                  className={`${
                    darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <tr>
                    <th className="px-3 py-2 border">Age Group</th>
                    <th className="px-3 py-2 border">Customers</th>
                    <th className="px-3 py-2 border">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.ageDistribution.map((dist, index) => (
                    <tr
                      key={index}
                      className={`${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-3 py-2 border text-center">
                        {dist.age_group}
                      </td>
                      <td className="px-3 py-2 border text-center">
                        {dist.count}
                      </td>
                      <td className="px-3 py-2 border text-center">
                        {dist.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Revenue Projections below */}
        <div
          className={`rounded-lg shadow p-3 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <h2 className="text-lg font-semibold mb-2 text-center">
            2026 Revenue Projections
          </h2>
          <div className="space-y-3">
            <div
              className={`p-2 rounded ${
                darkMode
                  ? 'bg-gradient-to-r from-green-800 to-green-600'
                  : 'bg-gradient-to-r from-green-400 to-green-500'
              } text-white`}
            >
              <h3 className="text-sm font-semibold mb-1">Q1 2026 Revenue</h3>
              <p className="text-lg font-bold">
                $
                {salesData.revenueTrends
                  .filter(trend =>
                    ['2026-01', '2026-02', '2026-03'].includes(trend.month)
                  )
                  .reduce((sum, trend) => sum + trend.revenue, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div
              className={`p-2 rounded ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-800 to-blue-600'
                  : 'bg-gradient-to-r from-blue-400 to-blue-500'
              } text-white`}
            >
              <h3 className="text-sm font-semibold mb-1">Full Year 2026 Revenue</h3>
              <p className="text-lg font-bold">
                $
                {salesData.revenueTrends
                  .filter(
                    trend => trend.month >= '2026-01' && trend.month <= '2026-12'
                  )
                  .reduce((sum, trend) => sum + trend.revenue, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
