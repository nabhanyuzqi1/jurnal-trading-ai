import React, { useState } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const News = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with real API data
  const newsItems = [
    {
      id: 1,
      title: 'Fed Signals Potential Rate Cuts in 2024',
      source: 'Financial Times',
      category: 'Monetary Policy',
      date: '2024-01-15',
      summary: 'Federal Reserve officials indicated they expect to cut interest rates three times in 2024 as inflation continues to moderate.',
      impact: 'High',
      sentiment: 'Bullish',
    },
    {
      id: 2,
      title: 'ECB Maintains Hawkish Stance on Inflation',
      source: 'Reuters',
      category: 'Central Banks',
      date: '2024-01-14',
      summary: 'European Central Bank President Christine Lagarde emphasized the need to remain vigilant on inflation despite recent improvements.',
      impact: 'Medium',
      sentiment: 'Bearish',
    },
    // Add more mock news items
  ];

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800';
      case 'medium':
        return darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'low':
        return darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'bearish':
        return darkMode ? 'text-red-400' : 'text-red-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market News</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              placeholder-gray-500 dark:placeholder-gray-400"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <NewspaperIcon className="h-4 w-4 mr-1" />
                    {item.source}
                  </span>
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {item.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact)}`}>
                  {item.impact} Impact
                </span>
                <span className={`text-sm font-medium ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{item.summary}</p>
            <div className="mt-4">
              <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No news items found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default News;
