import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 flex items-center ${type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Toast;