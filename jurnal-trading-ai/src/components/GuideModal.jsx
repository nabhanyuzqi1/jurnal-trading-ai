import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const GuideModal = ({ isOpen, onClose }) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className={`relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl ${darkMode ? 'dark' : ''}`}>
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-3">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              How to Use Trading Journal AI
            </h3>
            <div className="mt-4 space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Journal</h4>
                <p>Record your trades with entry/exit prices from MT4/MT5. Import/Export your data using CSV format.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Analysis</h4>
                <p>View your trading performance analytics and get AI-powered suggestions for improvement.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">News</h4>
                <p>Stay updated with the latest market news from Investing.com, ForexFactory, and MyFXBook.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Calculator</h4>
                <p>Manage your accounts, calculate position sizes, and get risk management suggestions.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Features</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Dark/Light mode toggle</li>
                  <li>CSV import/export</li>
                  <li>AI-powered analysis</li>
                  <li>Multiple account management</li>
                  <li>Real-time market data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
