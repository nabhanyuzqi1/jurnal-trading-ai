import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useAccounts } from './AccountContext';

const TradeContext = createContext();

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider = ({ children }) => {
  const { user } = useAuth();
  const { activeAccount } = useAccounts();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !activeAccount) {
      setTrades([]);
      setLoading(false);
      return;
    }

    const tradesRef = collection(db, 'users', user.uid, 'accounts', activeAccount.id, 'trades');
    const q = query(tradesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const tradesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrades(tradesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching trades:', err);
        setError('Failed to load trades');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, activeAccount]);

  const addTrade = async (tradeData) => {
    if (!user || !activeAccount) throw new Error('User must be authenticated and have an active account');
    
    try {
      const tradesRef = collection(db, 'users', user.uid, 'accounts', activeAccount.id, 'trades');
      const docRef = await addDoc(tradesRef, {
        ...tradeData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding trade:', err);
      throw new Error('Failed to add trade');
    }
  };

  const updateTrade = async (tradeId, tradeData) => {
    if (!user || !activeAccount) throw new Error('User must be authenticated and have an active account');
    
    try {
      const tradeRef = doc(db, 'users', user.uid, 'accounts', activeAccount.id, 'trades', tradeId);
      await updateDoc(tradeRef, tradeData);
    } catch (err) {
      console.error('Error updating trade:', err);
      throw new Error('Failed to update trade');
    }
  };

  const deleteTrade = async (tradeId) => {
    if (!user || !activeAccount) throw new Error('User must be authenticated and have an active account');
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'accounts', activeAccount.id, 'trades', tradeId));
    } catch (err) {
      console.error('Error deleting trade:', err);
      throw new Error('Failed to delete trade');
    }
  };

  const addWithdrawal = async (amount) => {
    if (!user || !activeAccount) throw new Error('User must be authenticated and have an active account');
    
    try {
      const withdrawalData = {
        pair: 'WITHDRAWAL',
        lotSize: 0,
        strategy: 'Penarikan Dana',
        position: 'wd',
        pl: -amount,
        notes: `Penarikan sejumlah ${amount}`,
        createdAt: serverTimestamp()
      };
      
      return await addTrade(withdrawalData);
    } catch (err) {
      console.error('Error recording withdrawal:', err);
      throw new Error('Failed to record withdrawal');
    }
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    const actualTrades = trades.filter(t => t.pair !== 'WITHDRAWAL');
    const totalPL = trades.reduce((acc, trade) => acc + trade.pl, 0);
    const wins = actualTrades.filter(trade => trade.pl > 0).length;
    const winRate = actualTrades.length > 0 ? (wins / actualTrades.length) * 100 : 0;
    const profitPercentage = activeAccount?.startBalance > 0 
      ? (totalPL / activeAccount.startBalance) * 100 
      : 0;

    return {
      totalPL,
      currentBalance: (activeAccount?.startBalance || 0) + totalPL,
      winRate,
      profitPercentage,
      totalTrades: actualTrades.length
    };
  };

  const value = {
    trades,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    addWithdrawal,
    getPerformanceMetrics
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};

export default TradeContext;
