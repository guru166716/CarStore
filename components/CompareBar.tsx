import React from 'react';
import { CarNormalized } from '../types';

interface CompareBarProps {
  selectedCars: CarNormalized[];
  onRemove: (id: string | number) => void;
  onClear: () => void;
  onCompare: () => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ selectedCars, onRemove, onClear, onCompare }) => {
  if (selectedCars.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 transform transition-transform duration-300 slide-up-animation">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap hidden sm:inline">
            Compare ({selectedCars.length}/3):
          </span>
          {selectedCars.map((car) => (
            <div key={car.id} className="relative flex-shrink-0 group">
              <img 
                src={car.image} 
                alt={car.title} 
                className="w-16 h-12 object-cover rounded border border-gray-200 dark:border-gray-700" 
              />
              <button 
                onClick={() => onRemove(car.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={onClear}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors px-3 py-2"
          >
            Clear
          </button>
          <button 
            onClick={onCompare}
            disabled={selectedCars.length < 2}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${
              selectedCars.length < 2 
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
            }`}
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;