import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AccountProvider } from './contexts/AccountContext';
import { TradeProvider } from './contexts/TradeContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Analysis from './pages/Analysis';
import News from './pages/News';
import Calculator from './pages/Calculator';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AccountProvider>
          <TradeProvider>
            <AnalyticsProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            <Route index element={<Home />} />
                            <Route path="/journal" element={<Journal />} />
                            <Route path="/analysis" element={<Analysis />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/calculator" element={<Calculator />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </AnalyticsProvider>
          </TradeProvider>
        </AccountProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
