import React, { useState } from 'react';
import { useTrades } from '../../contexts/TradeContext';
import { useAccounts } from '../../contexts/AccountContext';
import Modal from '../shared/Modal';
import TradeForm from './TradeForm';
import Confirmation from '../shared/Confirmation';
import LoadingSpinner from '../shared/LoadingSpinner';

const TradeList = () => {
  const { trades, loading, deleteTrade } = useTrades();
  const { activeAccount } = useAccounts();
  const [editTrade, setEditTrade] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  if (!activeAccount) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select an account to view trades.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedTrades = () => {
    const sortedTrades = [...trades].filter(trade => trade.pair !== 'WITHDRAWAL');
    
    sortedTrades.sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc'
          ? a.createdAt?.toMillis() - b.createdAt?.toMillis()
          : b.createdAt?.toMillis() - a.createdAt?.toMillis();
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortedTrades;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleDelete = async (trade) => {
    try {
      await deleteTrade(trade.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('createdAt')}
            >
              Date {getSortIcon('createdAt')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('pair')}
            >
              Pair {getSortIcon('pair')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('position')}
            >
              Position {getSortIcon('position')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('lotSize')}
            >
              Lot Size {getSortIcon('lotSize')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('pl')}
            >
              P/L {getSortIcon('pl')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('strategy')}
            >
              Strategy {getSortIcon('strategy')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {getSortedTrades().map((trade) => (
            <tr key={trade.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.createdAt?.toDate().toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {trade.pair}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`capitalize ${trade.position === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.position}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.lotSize}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trade.pl > 0 ? '+' : ''}{trade.pl}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {trade.strategy}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="max-w-xs truncate">
                  {trade.notes}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setEditTrade(trade)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(trade)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Trade Modal */}
      <Modal
        isOpen={!!editTrade}
        onClose={() => setEditTrade(null)}
        title="Edit Trade"
      >
        <TradeForm
          tradeToEdit={editTrade}
          onCancel={() => setEditTrade(null)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Trade"
        message="Are you sure you want to delete this trade? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default TradeList;
