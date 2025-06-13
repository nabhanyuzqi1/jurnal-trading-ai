import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const AccountContext = createContext();

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setAccounts([]);
      setActiveAccount(null);
      setLoading(false);
      return;
    }

    const accountsRef = collection(db, 'users', user.uid, 'accounts');
    const q = query(accountsRef, orderBy('name'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const accountsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAccounts(accountsData);
        
        // Handle active account
        const storedAccountId = localStorage.getItem(`activeAccountId_${user.uid}`);
        if (storedAccountId && accountsData.some(acc => acc.id === storedAccountId)) {
          setActiveAccount(accountsData.find(acc => acc.id === storedAccountId));
        } else if (accountsData.length > 0 && !activeAccount) {
          setActiveAccount(accountsData[0]);
          localStorage.setItem(`activeAccountId_${user.uid}`, accountsData[0].id);
        }
        
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createAccount = async (accountData) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      const accountsRef = collection(db, 'users', user.uid, 'accounts');
      const docRef = await addDoc(accountsRef, {
        ...accountData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error creating account:', err);
      throw new Error('Failed to create account');
    }
  };

  const deleteAccount = async (accountId) => {
    if (!user) throw new Error('User must be authenticated');
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'accounts', accountId));
      if (activeAccount?.id === accountId) {
        const remainingAccounts = accounts.filter(acc => acc.id !== accountId);
        if (remainingAccounts.length > 0) {
          setActiveAccount(remainingAccounts[0]);
          localStorage.setItem(`activeAccountId_${user.uid}`, remainingAccounts[0].id);
        } else {
          setActiveAccount(null);
          localStorage.removeItem(`activeAccountId_${user.uid}`);
        }
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      throw new Error('Failed to delete account');
    }
  };

  const setActiveAccountById = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setActiveAccount(account);
      localStorage.setItem(`activeAccountId_${user.uid}`, accountId);
    }
  };

  const value = {
    accounts,
    activeAccount,
    loading,
    error,
    createAccount,
    deleteAccount,
    setActiveAccountById
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
