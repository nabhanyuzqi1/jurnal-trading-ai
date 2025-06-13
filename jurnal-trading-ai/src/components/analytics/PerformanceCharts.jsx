import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useTrades } from '../../contexts/TradeContext';
import { useAccounts } from '../../contexts/AccountContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import AIService from '../../services/AIService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceCharts = () => {
  const { equityData, pairPerformance, strategyPerformance, getBestPerformers, getWorstPerformers } = useAnalytics();
  const { trades } = useTrades();
  const { activeAccount } = useAccounts();
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trades.length > 0) {
      generateAIAnalysis();
    }
  }, [trades]);

  const generateAIAnalysis = async () => {
    setLoading(true);
    try {
      const tradeHistory = {
        trades: trades.map(trade => ({
          pair: trade.pair,
          pl: trade.pl,
          strategy: trade.strategy,
          notes: trade.notes
        })),
        bestPerformers: getBestPerformers(),
        worstPerformers: getWorstPerformers()
      };

      const analysis = await AIService.analyzePerformance(tradeHistory);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const equityChartData = {
    labels: equityData.map(point => 
      new Date(point.x).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Account Balance',
        data: equityData.map(point => point.y),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }
    ]
  };

  const pairChartData = {
    labels: Object.keys(pairPerformance),
    datasets: [
      {
        label: 'Win Rate (%)',
        data: Object.values(pairPerformance).map(p => p.winRate),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const strategyChartData = {
    labels: Object.keys(strategyPerformance),
    datasets: [
      {
        data: Object.values(strategyPerformance).map(s => s.trades),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  };

  if (!activeAccount) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select an account to view performance analytics.</p>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No trades recorded yet. Start trading to see your performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Equity Curve */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Equity Curve</h2>
        <div className="h-[400px]">
          <Line
            data={equityChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: false
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pair Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Pair Performance</h2>
          <div className="h-[300px]">
            <Bar
              data={pairChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Strategy Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Strategy Distribution</h2>
          <div className="h-[300px]">
            <Pie
              data={strategyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Performance Analysis</h2>
          <button
            onClick={generateAIAnalysis}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : aiAnalysis ? (
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: aiAnalysis }}
          />
        ) : (
          <p className="text-gray-600">Click "Refresh Analysis" to generate AI insights about your trading performance.</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceCharts;
