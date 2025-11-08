import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChurnPage from './components/ChurnPage';
import SalesPage from './components/SalesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/churn" element={
            <ProtectedRoute>
              <Layout>
                <ChurnPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/sales" element={
            <ProtectedRoute>
              <Layout>
                <SalesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Login />} /> {/* Default to login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
