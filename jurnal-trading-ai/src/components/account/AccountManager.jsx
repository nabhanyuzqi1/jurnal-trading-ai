import React, { useState } from 'react';
import { useAccounts } from '../../contexts/AccountContext';
import Modal from '../shared/Modal';
import Confirmation from '../shared/Confirmation';
import LoadingSpinner from '../shared/LoadingSpinner';

const AccountManager = () => {
  const { 
    accounts, 
    activeAccount, 
    loading, 
    createAccount, 
    deleteAccount, 
    setActiveAccountById 
  } = useAccounts();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startBalance: '',
    currency: 'USD'
  });
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const accountData = {
        ...formData,
        startBalance: parseFloat(formData.startBalance)
      };

      await createAccount(accountData);
      setShowCreateModal(false);
      setFormData({ name: '', startBalance: '', currency: 'USD' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (account) => {
    try {
      await deleteAccount(account.id);
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Account List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Trading Accounts</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No accounts yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map(account => (
            <div
              key={account.id}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${activeAccount?.id === account.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}
              onClick={() => setActiveAccountById(account.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{account.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(account);
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Starting Balance: {account.currency} {account.startBalance.toLocaleString()}
              </div>
              {activeAccount?.id === account.id && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  Active Account
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Account"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Main Trading Account"
            />
          </div>

          <div>
            <label htmlFor="startBalance" className="block text-sm font-medium text-gray-700">
              Starting Balance
            </label>
            <input
              type="number"
              id="startBalance"
              name="startBalance"
              value={formData.startBalance}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-grow bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-grow bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Account"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will permanently delete all trades associated with this account. This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default AccountManager;
