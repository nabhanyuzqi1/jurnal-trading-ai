import React from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const { darkMode } = useTheme();

  // Mock data - replace with real data from Firebase
  const pieData = {
    labels: ['Winning Trades', 'Losing Trades'],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ['#22c55e', '#ef4444'],
        borderColor: ['#16a34a', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Profit/Loss',
        data: [150, -80, 200, -45, 300],
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value >= 0 ? '#22c55e' : '#ef4444';
        },
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: darkMode ? '#fff' : '#000'
        }
      },
      title: {
        display: true,
        text: 'Daily Performance',
        color: darkMode ? '#fff' : '#000'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#fff' : '#000'
        }
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#fff' : '#000'
        }
      }
    },
  };

  const stats = {
    totalTrades: 150,
    winningTrades: 98,
    losingTrades: 52,
    winRate: '65.33%',
    avgWin: '$120.50',
    avgLoss: '$45.20',
    largestWin: '$500.00',
    largestLoss: '$200.00',
    profitFactor: '2.67',
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trading Analysis</h1>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.winRate}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Factor</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{stats.profitFactor}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Win/Loss Ratio</h3>
          <div className="h-64">
            <Pie data={pieData} options={{
              plugins: {
                legend: {
                  labels: {
                    color: darkMode ? '#fff' : '#000'
                  }
                }
              }
            }} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Performance Overview</h3>
          <div className="h-64">
            <Bar options={barOptions} data={barData} />
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
            Detailed Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Trades</p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{stats.totalTrades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Winning Trades</p>
              <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">{stats.winningTrades}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Win</p>
              <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">{stats.avgWin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Loss</p>
              <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{stats.avgLoss}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Largest Win</p>
              <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">{stats.largestWin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Largest Loss</p>
              <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">{stats.largestLoss}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
