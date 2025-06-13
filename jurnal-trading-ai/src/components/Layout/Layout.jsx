import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  HomeIcon,
  ChartBarIcon,
  NewspaperIcon,
  CalculatorIcon,
  BookOpenIcon,
  SunIcon,
  MoonIcon,
  HeartIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import GuideModal from '../GuideModal';

const Layout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [showFAB, setShowFAB] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleGuideClick = useCallback(() => {
    setShowGuide(true);
    setShowFAB(false);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Journal', href: '/journal', icon: BookOpenIcon },
    { name: 'Analysis', href: '/analysis', icon: ChartBarIcon },
    { name: 'News', href: '/news', icon: NewspaperIcon },
    { name: 'Calculator', href: '/calculator', icon: CalculatorIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header with Theme Toggle */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Trading Journal AI</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-20">
        {children}
      </main>

      {/* FAB Menu */}
      <div className="fixed right-4 bottom-20 flex flex-col gap-2">
        {showFAB && (
          <>
            <button
              onClick={() => window.open('https://ko-fi.com/yourusername', '_blank')}
              className="p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleGuideClick}
              className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </>
        )}
        <button
          onClick={() => setShowFAB(!showFAB)}
          className="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {showFAB ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-3 px-4 ${
                  isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Guide Modal */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

export default Layout;
