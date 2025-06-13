import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  // Mock data - replace with real data from Firebase
  const recentTrades = [
    { id: 1, pair: 'EUR/USD', type: 'BUY', profit: 120.50, date: '2024-01-15' },
    { id: 2, pair: 'BTC/USD', type: 'SELL', profit: -45.20, date: '2024-01-14' },
    { id: 3, pair: 'GBP/JPY', type: 'BUY', profit: 67.80, date: '2024-01-13' },
  ];

  const stats = {
    winRate: '65%',
    totalTrades: 150,
    profitFactor: 1.8,
    netProfit: 2450.75
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.email?.split('@')[0] || 'Trader'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.winRate}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalTrades}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.profitFactor}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">${stats.netProfit}</p>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{trade.pair}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{trade.date}</p>
              </div>
              <div className="flex items-center">
                {trade.profit > 0 ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 text-red-500 mr-2" />
                )}
                <span className={trade.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                  ${Math.abs(trade.profit).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
