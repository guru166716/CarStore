import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg border border-red-200 dark:border-red-900 shadow-sm max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;