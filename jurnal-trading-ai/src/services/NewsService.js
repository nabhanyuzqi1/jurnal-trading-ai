class NewsService {
  static RSS_TO_JSON_API = process.env.REACT_APP_RSS_TO_JSON_API;
  static INVESTING_RSS_URL = "https://www.investing.com/rss/news_285.rss";

  static async fetchNews() {
    try {
      const response = await fetch(`${this.RSS_TO_JSON_API}?rss_url=${encodeURIComponent(this.INVESTING_RSS_URL)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('Failed to fetch news from API');
      }

      return data.items.map(item => ({
        title: item.title,
        link: item.link,
        description: this.cleanDescription(item.description),
        pubDate: new Date(item.pubDate),
        source: 'Investing.com'
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to load news');
    }
  }

  static cleanDescription(description) {
    // Remove HTML tags and limit to first two sentences
    const cleanText = description.replace(/<[^>]*>?/gm, '');
    const sentences = cleanText.split('.');
    return sentences.slice(0, 2).join('.') + '.';
  }

  static async fetchForexFactoryCalendar() {
    try {
      // Since Forex Factory doesn't provide a public API or RSS feed,
      // we'll return a message directing users to their website
      return {
        error: true,
        message: `
          Forex Factory calendar cannot be embedded directly.
          Please visit https://www.forexfactory.com/calendar for the official calendar.
        `
      };
    } catch (error) {
      console.error('Error fetching calendar:', error);
      throw new Error('Failed to load economic calendar');
    }
  }

  // Format news data for AI analysis
  static formatNewsForAI(news, limit = 10) {
    return news
      .slice(0, limit)
      .map(item => item.title)
      .join('. ');
  }

  // Get news specific to certain currency pairs
  static filterNewsByPairs(news, pairs) {
    const pairKeywords = pairs.map(pair => {
      const [base, quote] = pair.split('/');
      return [base, quote, pair.replace('/', '')];
    }).flat();

    const keywords = new RegExp(pairKeywords.join('|'), 'i');

    return news.filter(item =>
      keywords.test(item.title) || keywords.test(item.description)
    );
  }

  // Get high-impact news events
  static getHighImpactNews(news) {
    const highImpactKeywords = [
      'NFP',
      'Non-Farm',
      'Fed',
      'FOMC',
      'ECB',
      'BOE',
      'BOJ',
      'Rate Decision',
      'CPI',
      'GDP',
      'Employment'
    ];

    const keywords = new RegExp(highImpactKeywords.join('|'), 'i');

    return news.filter(item =>
      keywords.test(item.title) || keywords.test(item.description)
    );
  }

  // Group news by currency
  static groupNewsByCurrency(news) {
    const currencyGroups = {
      USD: [],
      EUR: [],
      GBP: [],
      JPY: [],
      AUD: [],
      CAD: [],
      CHF: [],
      NZD: [],
      Other: []
    };

    news.forEach(item => {
      let assigned = false;
      for (const currency of Object.keys(currencyGroups)) {
        if (
          item.title.includes(currency) || 
          item.description.includes(currency)
        ) {
          currencyGroups[currency].push(item);
          assigned = true;
          break;
        }
      }
      if (!assigned) {
        currencyGroups.Other.push(item);
      }
    });

    return currencyGroups;
  }

  // Get market sentiment based on news
  static getMarketSentiment(news) {
    const bullishKeywords = [
      'surge', 'gain', 'rise', 'jump', 'soar', 'higher',
      'strong', 'positive', 'bullish', 'optimistic', 'recovery'
    ];

    const bearishKeywords = [
      'fall', 'drop', 'decline', 'slip', 'plunge', 'lower',
      'weak', 'negative', 'bearish', 'pessimistic', 'recession'
    ];

    let bullishCount = 0;
    let bearishCount = 0;

    news.forEach(item => {
      const text = `${item.title} ${item.description}`.toLowerCase();
      
      bullishKeywords.forEach(keyword => {
        if (text.includes(keyword)) bullishCount++;
      });
      
      bearishKeywords.forEach(keyword => {
        if (text.includes(keyword)) bearishCount++;
      });
    });

    return {
      bullishCount,
      bearishCount,
      sentiment: bullishCount > bearishCount ? 'bullish' : 
                 bearishCount > bullishCount ? 'bearish' : 'neutral',
      strength: Math.abs(bullishCount - bearishCount) / (bullishCount + bearishCount)
    };
  }
}

export default NewsService;
