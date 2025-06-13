import React, { useState, useEffect } from 'react';
import { useAccounts } from '../../contexts/AccountContext';
import AIService from '../../services/AIService';
import LoadingSpinner from '../shared/LoadingSpinner';

const RiskCalculator = () => {
  const { activeAccount } = useAccounts();
  const [formData, setFormData] = useState({
    pair: '',
    riskPercentage: '1',
    stopLoss: '',
    entryPrice: '',
    direction: 'buy'
  });
  const [result, setResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when account changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      riskPercentage: '1'
    }));
    setResult(null);
    setAiAnalysis('');
  }, [activeAccount]);

  const calculateLotSize = () => {
    if (!activeAccount) {
      setError('Please select an account first');
      return;
    }

    const balance = activeAccount.startBalance;
    const riskAmount = (balance * (parseFloat(formData.riskPercentage) / 100));
    const stopLossPips = Math.abs(parseFloat(formData.stopLoss));
    
    if (!stopLossPips) {
      setError('Please enter a valid stop loss');
      return;
    }

    // Standard lot = 100,000 units
    // 1 pip on a standard lot = $10 for USD pairs
    const pipValue = 10; // Simplified for USD pairs
    const lotSize = (riskAmount / (stopLossPips * pipValue)).toFixed(2);

    return {
      riskAmount: riskAmount.toFixed(2),
      lotSize,
      potentialLoss: (-riskAmount).toFixed(2),
      stopLossPips
    };
  };

  const getAIAnalysis = async (calculationResult) => {
    try {
      const analysis = await AIService.getRiskAnalysis({
        accountCurrency: activeAccount.currency,
        balance: activeAccount.startBalance,
        riskPercentage: formData.riskPercentage,
        stopLoss: calculationResult.stopLossPips,
        lotSize: calculationResult.lotSize,
        pair: formData.pair
      });
      setAiAnalysis(analysis);
    } catch (err) {
      console.error('Error getting AI analysis:', err);
      setAiAnalysis('AI analysis unavailable at the moment.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const calculationResult = calculateLotSize();
      if (calculationResult) {
        setResult(calculationResult);
        await getAIAnalysis(calculationResult);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!activeAccount) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select an account to use the calculator.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Position Size Calculator</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pair" className="block text-sm font-medium text-gray-700">
                Currency Pair
              </label>
              <input
                type="text"
                id="pair"
                name="pair"
                value={formData.pair}
                onChange={handleChange}
                required
                placeholder="e.g., EUR/USD"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="riskPercentage" className="block text-sm font-medium text-gray-700">
                Risk Percentage
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="riskPercentage"
                  name="riskPercentage"
                  value={formData.riskPercentage}
                  onChange={handleChange}
                  required
                  min="0.1"
                  max="10"
                  step="0.1"
                  className="block w-full rounded-md border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700">
                Entry Price
              </label>
              <input
                type="number"
                id="entryPrice"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                required
                step="0.00001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700">
                Stop Loss (in pips)
              </label>
              <input
                type="number"
                id="stopLoss"
                name="stopLoss"
                value={formData.stopLoss}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
                Direction
              </label>
              <select
                id="direction"
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg
              hover:bg-blue-700 transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Calculating...' : 'Calculate Position Size'}
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Position Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Recommended Lot Size:</dt>
                    <dd className="font-medium">{result.lotSize}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Risk Amount:</dt>
                    <dd className="font-medium text-red-600">
                      {activeAccount.currency} {result.riskAmount}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stop Loss Distance:</dt>
                    <dd className="font-medium">{result.stopLossPips} pips</dd>
                  </div>
                </dl>
              </div>

              {aiAnalysis && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: aiAnalysis }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCalculator;
