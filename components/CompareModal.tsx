import React from 'react';
import { CarNormalized } from '../types';

interface CompareModalProps {
  isOpen: boolean;
  cars: CarNormalized[];
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, cars, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-5xl border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Comparison</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 bg-gray-50 dark:bg-gray-950 min-w-[150px]"></th>
                  {cars.map(car => (
                    <th key={car.id} className="p-4 min-w-[250px] align-top">
                      <img src={car.image} alt={car.title} className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm" />
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{car.title}</h4>
                      <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mt-1">${car.price.toLocaleString()}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { label: 'Year', key: 'year' },
                  { label: 'Make', key: 'brand' },
                  { label: 'Model', key: 'model' },
                  { label: 'Mileage', key: 'mileage', format: (val: any) => `${val.toLocaleString()} mi` },
                  { label: 'Fuel Type', key: 'fuelType' },
                  { label: 'Transmission', key: 'transmission' },
                  { label: 'Location', key: 'location' }
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-gray-800">
                      {row.label}
                    </td>
                    {cars.map(car => (
                      <td key={car.id} className="p-4 text-gray-900 dark:text-white font-medium">
                        {/* @ts-ignore */}
                        {row.format ? row.format(car[row.key]) : car[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;