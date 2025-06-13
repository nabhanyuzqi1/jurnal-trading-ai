import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

const COLLECTION_NAME = 'trades';

export const journalService = {
  // Add a new trade entry
  async addTrade(userId, tradeData) {
    try {
      const tradesRef = collection(db, COLLECTION_NAME);
      const trade = {
        ...tradeData,
        userId,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(tradesRef, trade);
      return { id: docRef.id, ...trade };
    } catch (error) {
      console.error('Error adding trade:', error);
      throw error;
    }
  },

  // Get all trades for a user
  async getUserTrades(userId) {
    try {
      const tradesRef = collection(db, COLLECTION_NAME);
      const q = query(
        tradesRef,
        where('userId', '==', userId),
        orderBy('time', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting trades:', error);
      throw error;
    }
  },

  // Parse CSV data
  parseCSV(csvText) {
    const lines = csvText.trim().split('\\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const trade = {};
      
      headers.forEach((header, index) => {
        let value = values[index];
        // Convert string numbers to actual numbers
        if (!isNaN(value) && value.trim() !== '') {
          value = Number(value);
        }
        trade[header.trim()] = value;
      });
      
      return trade;
    });
  },

  // Generate CSV content from trades
  generateCSV(trades) {
    const headers = [
      'time',
      'position',
      'symbol',
      'type',
      'volume',
      'prive',
      'sl',
      'tp',
      'time',
      'prive',
      'commission',
      'swap',
      'profit'
    ];

    const csvContent = [
      headers.join(','),
      ...trades.map(trade => 
        headers.map(header => trade[header] || '').join(',')
      )
    ].join('\\n');

    return csvContent;
  },

  // Download CSV file
  downloadCSV(csvContent, filename = 'trades.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
