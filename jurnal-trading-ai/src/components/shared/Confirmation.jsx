import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const Confirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Konfirmasi', 
  message, 
  confirmText = 'Ya', 
  cancelText = 'Tidak',
  type = 'danger' 
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        };
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        };
      default:
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
    >
      <div className="text-center">
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className={`${buttonStyles.confirm} text-white font-bold py-2 px-6 rounded-lg transition-colors`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className={`${buttonStyles.cancel} font-bold py-2 px-6 rounded-lg transition-colors`}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

Confirmation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info'])
};

export default Confirmation;
