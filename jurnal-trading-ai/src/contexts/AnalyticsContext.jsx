import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTrades } from './TradeContext';
import { useAccounts } from './AccountContext';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const { trades } = useTrades();
  const { activeAccount } = useAccounts();
  const [equityData, setEquityData] = useState([]);
  const [pairPerformance, setPairPerformance] = useState({});
  const [strategyPerformance, setStrategyPerformance] = useState({});

  useEffect(() => {
    if (!trades.length || !activeAccount) {
      resetAnalytics();
      return;
    }

    calculateEquityCurve();
    calculatePairPerformance();
    calculateStrategyPerformance();
  }, [trades, activeAccount]);

  const resetAnalytics = () => {
    setEquityData([]);
    setPairPerformance({});
    setStrategyPerformance({});
  };

  const calculateEquityCurve = () => {
    const startBalance = activeAccount?.startBalance || 0;
    let runningBalance = startBalance;
    
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => 
      (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
    );

    const data = [{
      x: sortedTrades[0]?.createdAt?.toDate() || new Date(),
      y: startBalance
    }];

    sortedTrades.forEach(trade => {
      if (trade.createdAt) {
        runningBalance += trade.pl;
        data.push({
          x: trade.createdAt.toDate(),
          y: runningBalance
        });
      }
    });

    setEquityData(data);
  };

  const calculatePairPerformance = () => {
    const pairStats = trades
      .filter(t => t.pair !== 'WITHDRAWAL')
      .reduce((acc, trade) => {
        if (!acc[trade.pair]) {
          acc[trade.pair] = {
            totalPL: 0,
            wins: 0,
            losses: 0,
            trades: 0
          };
        }

        acc[trade.pair].totalPL += trade.pl;
        acc[trade.pair].trades += 1;
        if (trade.pl > 0) {
          acc[trade.pair].wins += 1;
        } else if (trade.pl < 0) {
          acc[trade.pair].losses += 1;
        }

        return acc;
      }, {});

    // Calculate win rates and other metrics
    Object.keys(pairStats).forEach(pair => {
      const stats = pairStats[pair];
      stats.winRate = (stats.wins / stats.trades) * 100;
      stats.averagePL = stats.totalPL / stats.trades;
    });

    setPairPerformance(pairStats);
  };

  const calculateStrategyPerformance = () => {
    const strategyStats = trades
      .filter(t => t.pair !== 'WITHDRAWAL')
      .reduce((acc, trade) => {
        if (!acc[trade.strategy]) {
          acc[trade.strategy] = {
            totalPL: 0,
            wins: 0,
            losses: 0,
            trades: 0
          };
        }

        acc[trade.strategy].totalPL += trade.pl;
        acc[trade.strategy].trades += 1;
        if (trade.pl > 0) {
          acc[trade.strategy].wins += 1;
        } else if (trade.pl < 0) {
          acc[trade.strategy].losses += 1;
        }

        return acc;
      }, {});

    // Calculate win rates and other metrics
    Object.keys(strategyStats).forEach(strategy => {
      const stats = strategyStats[strategy];
      stats.winRate = (stats.wins / stats.trades) * 100;
      stats.averagePL = stats.totalPL / stats.trades;
    });

    setStrategyPerformance(strategyStats);
  };

  // Get best and worst performing pairs/strategies
  const getBestPerformers = () => {
    const bestPair = Object.entries(pairPerformance)
      .sort(([,a], [,b]) => b.totalPL - a.totalPL)[0];
    
    const bestStrategy = Object.entries(strategyPerformance)
      .sort(([,a], [,b]) => b.totalPL - a.totalPL)[0];

    return {
      pair: bestPair ? { name: bestPair[0], ...bestPair[1] } : null,
      strategy: bestStrategy ? { name: bestStrategy[0], ...bestStrategy[1] } : null
    };
  };

  const getWorstPerformers = () => {
    const worstPair = Object.entries(pairPerformance)
      .sort(([,a], [,b]) => a.totalPL - b.totalPL)[0];
    
    const worstStrategy = Object.entries(strategyPerformance)
      .sort(([,a], [,b]) => a.totalPL - b.totalPL)[0];

    return {
      pair: worstPair ? { name: worstPair[0], ...worstPair[1] } : null,
      strategy: worstStrategy ? { name: worstStrategy[0], ...worstStrategy[1] } : null
    };
  };

  const value = {
    equityData,
    pairPerformance,
    strategyPerformance,
    getBestPerformers,
    getWorstPerformers
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContext;
