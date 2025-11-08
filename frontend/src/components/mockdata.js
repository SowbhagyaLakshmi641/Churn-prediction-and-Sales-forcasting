// Mock data for Churn Prediction
export const churnData = {
  topCustomers: [
    { id: 1, name: 'Customer A', churnProbability: 95 },
    { id: 2, name: 'Customer B', churnProbability: 92 },
    { id: 3, name: 'Customer C', churnProbability: 89 },
    { id: 4, name: 'Customer D', churnProbability: 87 },
    { id: 5, name: 'Customer E', churnProbability: 85 },
    { id: 6, name: 'Customer F', churnProbability: 83 },
    { id: 7, name: 'Customer G', churnProbability: 81 },
    { id: 8, name: 'Customer H', churnProbability: 79 },
    { id: 9, name: 'Customer I', churnProbability: 77 },
    { id: 10, name: 'Customer J', churnProbability: 75 },
  ],
  churnTrends: [
    { month: 'Jan', churnRate: 5 },
    { month: 'Feb', churnRate: 7 },
    { month: 'Mar', churnRate: 6 },
    { month: 'Apr', churnRate: 8 },
    { month: 'May', churnRate: 9 },
    { month: 'Jun', churnRate: 7 },
    { month: 'Jul', churnRate: 10 },
    { month: 'Aug', churnRate: 8 },
    { month: 'Sep', churnRate: 6 },
    { month: 'Oct', churnRate: 7 },
    { month: 'Nov', churnRate: 9 },
    { month: 'Dec', churnRate: 11 },
  ],
  segmentation: [
    { name: 'High Risk', value: 30, color: '#FF6B6B' },
    { name: 'Medium Risk', value: 40, color: '#FFD93D' },
    { name: 'Low Risk', value: 30, color: '#6BCF7F' },
  ],
  countries: [
    { name: 'USA', churnRate: 8 },
    { name: 'UK', churnRate: 6 },
    { name: 'Germany', churnRate: 7 },
    { name: 'France', churnRate: 5 },
    { name: 'Canada', churnRate: 9 },
  ],
  categories: [
    {
      name: 'Sports',
      countryData: [
        { country: 'USA', churnRate: 8 },
        { country: 'UK', churnRate: 6 },
        { country: 'Germany', churnRate: 7 },
        { country: 'France', churnRate: 5 },
        { country: 'Canada', churnRate: 9 },
      ],
    },
    {
      name: 'Electronics',
      countryData: [
        { country: 'USA', churnRate: 10 },
        { country: 'UK', churnRate: 8 },
        { country: 'Germany', churnRate: 9 },
        { country: 'France', churnRate: 7 },
        { country: 'Canada', churnRate: 11 },
      ],
    },
    {
      name: 'Grocery',
      countryData: [
        { country: 'USA', churnRate: 6 },
        { country: 'UK', churnRate: 4 },
        { country: 'Germany', churnRate: 5 },
        { country: 'France', churnRate: 3 },
        { country: 'Canada', churnRate: 7 },
      ],
    },
    {
      name: 'Clothing',
      countryData: [
        { country: 'USA', churnRate: 12 },
        { country: 'UK', churnRate: 10 },
        { country: 'Germany', churnRate: 11 },
        { country: 'France', churnRate: 9 },
        { country: 'Canada', churnRate: 13 },
      ],
    },
    {
      name: 'Books',
      countryData: [
        { country: 'USA', churnRate: 4 },
        { country: 'UK', churnRate: 2 },
        { country: 'Germany', churnRate: 3 },
        { country: 'France', churnRate: 1 },
        { country: 'Canada', churnRate: 5 },
      ],
    },
  ],
};

// Mock data for Sales Forecasting
export const salesData = {
  forecast: {
    nextQuarter: 125000,
    nextYear: 500000,
  },
  topProducts: [
    { id: 1, name: 'Product A', predictedSales: 15000 },
    { id: 2, name: 'Product B', predictedSales: 14000 },
    { id: 3, name: 'Product C', predictedSales: 13000 },
    { id: 4, name: 'Product D', predictedSales: 12000 },
    { id: 5, name: 'Product E', predictedSales: 11000 },
    { id: 6, name: 'Product F', predictedSales: 10000 },
    { id: 7, name: 'Product G', predictedSales: 9000 },
    { id: 8, name: 'Product H', predictedSales: 8000 },
    { id: 9, name: 'Product I', predictedSales: 7000 },
    { id: 10, name: 'Product J', predictedSales: 6000 },
  ],
  salesTrends: [
    { month: 'Jan', sales: 80000 },
    { month: 'Feb', sales: 85000 },
    { month: 'Mar', sales: 90000 },
    { month: 'Apr', sales: 95000 },
    { month: 'May', sales: 100000 },
    { month: 'Jun', sales: 105000 },
    { month: 'Jul', sales: 110000 },
    { month: 'Aug', sales: 115000 },
    { month: 'Sep', sales: 120000 },
    { month: 'Oct', sales: 125000 },
    { month: 'Nov', sales: 130000 },
    { month: 'Dec', sales: 135000 },
  ],
  categories: [
    {
      name: 'Sports',
      forecast: 50000,
      countryData: [
        { country: 'USA', sales: 20000 },
        { country: 'UK', sales: 15000 },
        { country: 'Germany', sales: 8000 },
        { country: 'France', sales: 5000 },
        { country: 'Canada', sales: 2000 },
      ],
    },
    {
      name: 'Electronics',
      forecast: 75000,
      countryData: [
        { country: 'USA', sales: 30000 },
        { country: 'UK', sales: 20000 },
        { country: 'Germany', sales: 15000 },
        { country: 'France', sales: 8000 },
        { country: 'Canada', sales: 2000 },
      ],
    },
    {
      name: 'Grocery',
      forecast: 30000,
      countryData: [
        { country: 'USA', sales: 12000 },
        { country: 'UK', sales: 8000 },
        { country: 'Germany', sales: 6000 },
        { country: 'France', sales: 3000 },
        { country: 'Canada', sales: 1000 },
      ],
    },
    {
      name: 'Clothing',
      forecast: 40000,
      countryData: [
        { country: 'USA', sales: 16000 },
        { country: 'UK', sales: 12000 },
        { country: 'Germany', sales: 8000 },
        { country: 'France', sales: 3000 },
        { country: 'Canada', sales: 1000 },
      ],
    },
    {
      name: 'Books',
      forecast: 20000,
      countryData: [
        { country: 'USA', sales: 8000 },
        { country: 'UK', sales: 6000 },
        { country: 'Germany', sales: 4000 },
        { country: 'France', sales: 1500 },
        { country: 'Canada', sales: 500 },
      ],
    },
  ],
};
