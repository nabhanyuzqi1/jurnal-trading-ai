import React, { useState } from 'react';
import { useAccounts } from '../contexts/AccountContext';
import { journalService } from '../services/journalService';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import TradeForm from '../components/trade/TradeForm';
import TradeList from '../components/trade/TradeList';
import Modal from '../components/shared/Modal';
import Alert from '../components/shared/Alert';
import AIAnalysis from '../components/analytics/AIAnalysis';

const Journal = () => {
  const { activeAccount } = useAccounts();
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('trades'); // 'trades' or 'analysis'

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleFileUpload = async (event) => {
    if (!activeAccount) {
      showAlert('Please select an account first', 'error');
      return;
    }

    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target.result;
          const parsedTrades = journalService.parseCSV(text);
          
          // Upload each trade to Firebase
          for (const trade of parsedTrades) {
            await journalService.addTrade(activeAccount.id, trade);
          }
          
          showAlert('Trades imported successfully');
        };
        reader.readAsText(file);
      } catch (err) {
        setError('Failed to import trades');
        console.error(err);
      }
    }
  };

  const handleExport = () => {
    try {
      const csvContent = journalService.generateCSV(activeAccount.id);
      journalService.downloadCSV(csvContent);
    } catch (err) {
      setError('Failed to export trades');
      console.error(err);
    }
  };

  if (!activeAccount) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please select an account to view your trading journal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Trading Journal</h1>
          <p className="text-gray-600">
            Account: {activeAccount.name} ({activeAccount.currency})
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowTradeForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Trade
          </button>
          <div className="flex flex-col gap-2">
            {/* Import Button */}
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                Import CSV
              </label>
            </div>
            <a
              href="/template.csv"
              download
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Download Template
            </a>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('trades')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'trades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Trade History
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            AI Analysis
          </button>
        </nav>
      </div>

      {/* Content Section */}
      <div className="min-h-[500px]">
        {activeTab === 'trades' ? (
          <TradeList />
        ) : (
          <AIAnalysis />
        )}
      </div>

      {/* Add Trade Modal */}
      <Modal
        isOpen={showTradeForm}
        onClose={() => setShowTradeForm(false)}
        title="Add New Trade"
      >
        <TradeForm
          onCancel={() => setShowTradeForm(false)}
          onSuccess={() => {
            setShowTradeForm(false);
            showAlert('Trade added successfully');
          }}
        />
      </Modal>

      {/* Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default Journal;
