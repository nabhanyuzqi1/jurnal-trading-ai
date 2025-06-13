import React, { useState, useEffect } from 'react';
import NewsService from '../../services/NewsService';
import AIService from '../../services/AIService';
import LoadingSpinner from '../shared/LoadingSpinner';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [analyzingMarket, setAnalyzingMarket] = useState(false);

  const watchedPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD',
    'USD/CAD', 'USD/CHF', 'XAU/USD'
  ];

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      const newsData = await NewsService.fetchNews();
      setNews(newsData);
      setFilteredNews(newsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load news');
      setLoading(false);
    }
  };

  const filterNews = (filter) => {
    setActiveFilter(filter);
    let filtered = news;

    switch (filter) {
      case 'high-impact':
        filtered = NewsService.getHighImpactNews(news);
        break;
      case 'currencies':
        filtered = NewsService.filterNewsByPairs(news, watchedPairs);
        break;
      default:
        filtered = news;
    }

    setFilteredNews(filtered);
  };

  const getMarketAnalysis = async () => {
    setAnalyzingMarket(true);
    try {
      const newsHeadlines = NewsService.formatNewsForAI(filteredNews);
      const analysis = await AIService.getMarketAnalysis({
        watchedPairs,
        newsHeadlines
      });
      setAiAnalysis(analysis);
    } catch (err) {
      setError('Failed to generate market analysis');
    } finally {
      setAnalyzingMarket(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const newsDate = new Date(date);
    const diffInMinutes = Math.floor((now - newsDate) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return newsDate.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Analysis Button */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => filterNews('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All News
          </button>
          <button
            onClick={() => filterNews('high-impact')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'high-impact'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            High Impact
          </button>
          <button
            onClick={() => filterNews('currencies')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeFilter === 'currencies'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Currency Pairs
          </button>
        </div>

        <button
          onClick={getMarketAnalysis}
          disabled={analyzingMarket}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            bg-green-600 text-white transition-colors
            hover:bg-green-700
            ${analyzingMarket ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {analyzingMarket ? (
            <>
              <LoadingSpinner size="sm" />
              Analyzing...
            </>
          ) : (
            'Get AI Analysis'
          )}
        </button>
      </div>

      {/* AI Analysis Section */}
      {aiAnalysis && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: aiAnalysis }}
          />
        </div>
      )}

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No news found for the selected filter.</p>
          </div>
        ) : (
          filteredNews.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold mb-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(item.pubDate)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsSection;
