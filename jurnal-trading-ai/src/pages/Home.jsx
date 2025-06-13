import React from 'react';
import { useTrades } from '../contexts/TradeContext';
import { useAccounts } from '../contexts/AccountContext';
import AccountManager from '../components/account/AccountManager';
import PerformanceCharts from '../components/analytics/PerformanceCharts';
import MarketWatch from '../components/market/MarketWatch';
import NewsSection from '../components/news/NewsSection';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Home = () => {
  const { trades, loading: tradesLoading } = useTrades();
  const { activeAccount, loading: accountLoading } = useAccounts();

  if (accountLoading || tradesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Quick stats calculation
  const getQuickStats = () => {
    if (!trades.length || !activeAccount) return null;

    const actualTrades = trades.filter(t => t.pair !== 'WITHDRAWAL');
    const wins = actualTrades.filter(t => t.pl > 0).length;
    const totalPL = trades.reduce((sum, t) => sum + t.pl, 0);
    const startBalance = activeAccount.startBalance;
    const currentBalance = startBalance + totalPL;
    const profitPercentage = ((currentBalance - startBalance) / startBalance) * 100;

    return {
      totalTrades: actualTrades.length,
      winRate: actualTrades.length ? (wins / actualTrades.length) * 100 : 0,
      profitLoss: totalPL,
      profitPercentage,
      currentBalance
    };
  };

  const stats = getQuickStats();

  return (
    <div className="space-y-8">
      {/* Account Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Trading Accounts</h2>
        <AccountManager />
      </section>

      {/* Quick Stats */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {activeAccount.currency} {stats.currentBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <p className={`mt-2 ${stats.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profitPercentage >= 0 ? '↑' : '↓'} {Math.abs(stats.profitPercentage).toFixed(2)}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total P/L</h3>
            <p className={`mt-2 text-3xl font-bold ${stats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
            <p className="mt-2 text-gray-600">{activeAccount.currency}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.winRate.toFixed(1)}%
            </p>
            <p className="mt-2 text-gray-600">{stats.totalTrades} total trades</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Today's Trades</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {trades.filter(t => 
                t.createdAt?.toDate().toDateString() === new Date().toDateString()
              ).length}
            </p>
            <p className="mt-2 text-gray-600">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>
      )}

      {/* Performance Charts */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
        <PerformanceCharts />
      </section>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Market Watch</h2>
          <MarketWatch />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Latest News</h2>
          <NewsSection />
        </section>
      </div>
    </div>
  );
};

export default Home;
