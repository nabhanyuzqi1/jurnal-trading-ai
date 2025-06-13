import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Calculator = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    accountSize: '',
    riskPercentage: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePosition = () => {
    const accountSize = parseFloat(formData.accountSize);
    const riskPercentage = parseFloat(formData.riskPercentage);
    const entry = parseFloat(formData.entryPrice);
    const stop = parseFloat(formData.stopLoss);
    const target = parseFloat(formData.takeProfit);

    if (!accountSize || !riskPercentage || !entry || !stop || !target) {
      return;
    }

    const riskAmount = (accountSize * (riskPercentage / 100));
    const priceDifference = Math.abs(entry - stop);
    const positionSize = riskAmount / priceDifference;
    const potentialProfit = Math.abs(target - entry) * positionSize;
    const riskRewardRatio = potentialProfit / riskAmount;

    setResults({
      positionSize: positionSize.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      potentialProfit: potentialProfit.toFixed(2),
      riskRewardRatio: riskRewardRatio.toFixed(2),
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Position Calculator</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Input Form */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account Size ($)
            </label>
            <input
              type="number"
              name="accountSize"
              value={formData.accountSize}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Risk Percentage (%)
            </label>
            <input
              type="number"
              name="riskPercentage"
              value={formData.riskPercentage}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entry Price
            </label>
            <input
              type="number"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="1.2000"
              step="0.00001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stop Loss
            </label>
            <input
              type="number"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="1.1950"
              step="0.00001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Take Profit
            </label>
            <input
              type="number"
              name="takeProfit"
              value={formData.takeProfit}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="1.2100"
              step="0.00001"
            />
          </div>
        </div>

        <button
          onClick={calculatePosition}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate
        </button>

        {/* Results */}
        {results && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Position Size</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {results.positionSize} units
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Risk Amount</p>
                <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                  ${results.riskAmount}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Potential Profit</p>
                <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                  ${results.potentialProfit}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Risk:Reward Ratio</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  1:{results.riskRewardRatio}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
