import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTrades } from '../../contexts/TradeContext';
import { useAccounts } from '../../contexts/AccountContext';

const DEFAULT_PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", 
  "USD/CAD", "USD/CHF", "XAU/USD", "BTC/USD"
];

const DEFAULT_STRATEGIES = [
  "Supply and Demand", "Breakout", "Trend Following",
  "Scalping", "Swing Trading", "Fibonacci Retracement",
  "Smart Money Concept"
];

const TradeForm = ({ tradeToEdit = null, onCancel }) => {
  const { addTrade, updateTrade, trades } = useTrades();
  const { activeAccount } = useAccounts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    pair: '',
    lotSize: '',
    strategy: '',
    position: 'buy',
    pl: '',
    notes: ''
  });

  const [suggestions, setSuggestions] = useState({
    pairs: DEFAULT_PAIRS,
    strategies: DEFAULT_STRATEGIES
  });

  useEffect(() => {
    if (tradeToEdit) {
      setFormData({
        pair: tradeToEdit.pair,
        lotSize: tradeToEdit.lotSize,
        strategy: tradeToEdit.strategy,
        position: tradeToEdit.position,
        pl: tradeToEdit.pl,
        notes: tradeToEdit.notes || ''
      });
    }
  }, [tradeToEdit]);

  useEffect(() => {
    // Update suggestions based on existing trades
    const tradePairs = trades
      .filter(t => t.pair !== 'WITHDRAWAL')
      .map(t => t.pair);
    const tradeStrategies = trades
      .filter(t => t.pair !== 'WITHDRAWAL')
      .map(t => t.strategy);

    setSuggestions({
      pairs: [...new Set([...DEFAULT_PAIRS, ...tradePairs])].sort(),
      strategies: [...new Set([...DEFAULT_STRATEGIES, ...tradeStrategies])].sort()
    });
  }, [trades]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAccount) {
      setError('Please select an active account first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tradeData = {
        ...formData,
        lotSize: parseFloat(formData.lotSize),
        pl: parseFloat(formData.pl)
      };

      if (tradeToEdit) {
        await updateTrade(tradeToEdit.id, tradeData);
      } else {
        await addTrade(tradeData);
      }

      resetForm();
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

  const resetForm = () => {
    setFormData({
      pair: '',
      lotSize: '',
      strategy: '',
      position: 'buy',
      pl: '',
      notes: ''
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">
        {tradeToEdit ? 'Edit Trade' : 'New Trade'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pair" className="block text-sm font-medium">
              Pair
            </label>
            <input
              type="text"
              id="pair"
              name="pair"
              list="pair-list"
              value={formData.pair}
              onChange={handleChange}
              placeholder="e.g., EUR/USD"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <datalist id="pair-list">
              {suggestions.pairs.map(pair => (
                <option key={pair} value={pair} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="lotSize" className="block text-sm font-medium">
              Lot Size
            </label>
            <input
              type="number"
              id="lotSize"
              name="lotSize"
              value={formData.lotSize}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="e.g., 0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="strategy" className="block text-sm font-medium">
            Strategy
          </label>
          <input
            type="text"
            id="strategy"
            name="strategy"
            list="strategy-list"
            value={formData.strategy}
            onChange={handleChange}
            placeholder="e.g., Breakout"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <datalist id="strategy-list">
            {suggestions.strategies.map(strategy => (
              <option key={strategy} value={strategy} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-medium">
              Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div>
            <label htmlFor="pl" className="block text-sm font-medium">
              Profit/Loss
            </label>
            <input
              type="number"
              id="pl"
              name="pl"
              value={formData.pl}
              onChange={handleChange}
              step="any"
              placeholder="e.g., 50 or -25"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add your trade notes here..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`
              flex-grow bg-blue-600 text-white font-bold py-2 px-4 rounded-lg
              hover:bg-blue-700 transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Saving...' : tradeToEdit ? 'Update Trade' : 'Save Trade'}
          </button>

          {(tradeToEdit || onCancel) && (
            <button
              type="button"
              onClick={resetForm}
              className="flex-grow bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

TradeForm.propTypes = {
  tradeToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    pair: PropTypes.string.isRequired,
    lotSize: PropTypes.number.isRequired,
    strategy: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    pl: PropTypes.number.isRequired,
    notes: PropTypes.string
  }),
  onCancel: PropTypes.func
};

export default TradeForm;
