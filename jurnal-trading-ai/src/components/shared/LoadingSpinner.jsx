import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', className = '', fullScreen = false }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4 border-2';
      case 'lg':
        return 'w-12 h-12 border-4';
      default:
        return 'w-8 h-8 border-3';
    }
  };

  const spinner = (
    <div className={`inline-block ${getSizeClasses()} ${className}`}>
      <div 
        className={`
          rounded-full 
          border-blue-500 
          border-solid 
          animate-spin
          border-t-transparent
          ${getSizeClasses()}
        `}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;
