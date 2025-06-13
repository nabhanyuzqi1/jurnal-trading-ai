import React, { useState } from 'react';
import { useTrades } from '../../contexts/TradeContext';
import { useAccounts } from '../../contexts/AccountContext';
import AIService from '../../services/AIService';
import LoadingSpinner from '../shared/LoadingSpinner';

const AIAnalysis = () => {
  const { trades } = useTrades();
  const { activeAccount } = useAccounts();
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeTrade = async (trade) => {
    setLoading(true);
    setError('');
    setSelectedTrade(trade);

    try {
      const analysis = await AIService.analyzeTrade(trade, activeAccount?.currency);
      setAnalysis(analysis);
    } catch (err) {
      setError('Failed to generate analysis. Please try again.');
      console.error('AI Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!activeAccount) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select an account to analyze trades.</p>
      </div>
    );
  }

  const actualTrades = trades.filter(t => t.pair !== 'WITHDRAWAL');

  if (actualTrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No trades recorded yet. Start trading to get AI analysis.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Trade List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Select Trade to Analyze</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {actualTrades.map((trade) => (
            <div
              key={trade.id}
              onClick={() => analyzeTrade(trade)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedTrade?.id === trade.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{trade.pair}</h3>
                  <p className="text-sm text-gray-600">
                    {trade.createdAt?.toDate().toLocaleDateString()}
                  </p>
                </div>
                <span className={`font-medium ${
                  trade.pl >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trade.pl > 0 ? '+' : ''}{trade.pl} {activeAccount.currency}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Strategy:</span> {trade.strategy}
                </p>
                {trade.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Notes:</span> {trade.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">AI Trade Analysis</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Analyzing trade...</p>
          </div>
        ) : selectedTrade ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Selected Trade</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Pair:</span> {selectedTrade.pair}</p>
                  <p><span className="font-medium">Position:</span> {selectedTrade.position}</p>
                  <p><span className="font-medium">Lot Size:</span> {selectedTrade.lotSize}</p>
                </div>
                <div>
                  <p><span className="font-medium">Strategy:</span> {selectedTrade.strategy}</p>
                  <p><span className="font-medium">P/L:</span> <span className={
                    selectedTrade.pl >= 0 ? 'text-green-600' : 'text-red-600'
                  }>{selectedTrade.pl > 0 ? '+' : ''}{selectedTrade.pl} {activeAccount.currency}</span></p>
                  <p><span className="font-medium">Date:</span> {selectedTrade.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
              </div>
              {selectedTrade.notes && (
                <div className="mt-2">
                  <p className="font-medium">Notes:</p>
                  <p className="text-sm text-gray-600">{selectedTrade.notes}</p>
                </div>
              )}
            </div>

            <div className="prose prose-blue max-w-none">
              <h3 className="text-lg font-semibold">Analysis</h3>
              <div dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            Select a trade from the list to get AI analysis
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
