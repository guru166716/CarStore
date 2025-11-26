import React from 'react';
import { Link } from 'react-router-dom';
import { CarNormalized } from '../types';

interface CarCardProps {
  car: CarNormalized;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  isCompared?: boolean;
  onToggleCompare?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isFavorite = false, onToggleFavorite, isCompared = false, onToggleCompare }) => {
  
  // Smart Badging Logic
  const isNew = car.year >= new Date().getFullYear() - 1;
  const isLowMileage = car.mileage < 15000;
  const isGreatDeal = car.price < 35000 && car.year >= 2021;

  return (
    <div className="group bg-white dark:bg-gray-850 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full relative">
      
      {/* Favorite Button Overlay */}
      <button 
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-black/70 transition-colors"
        aria-label="Add to favorites"
      >
        <svg 
          className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-300'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isNew && <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">New Arrival</span>}
        {isLowMileage && <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">Low Mileage</span>}
        {isGreatDeal && <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">Great Deal</span>}
      </div>

      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={car.image}
          alt={car.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${car.id}/400/300`;
          }}
        />
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white shadow-sm">
          {car.year}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
           <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{car.brand}</span>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{car.title}</h3>
        </div>
        
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
           <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
             <span>⛽ {car.fuelType}</span>
           </div>
           <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
             <span>⚙️ {car.transmission}</span>
           </div>
           <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1.5 rounded col-span-2">
             <span>📍 {car.location}</span>
           </div>
           <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1.5 rounded col-span-2">
             <span>🛣️ {car.mileage.toLocaleString()} mi</span>
           </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Price</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ${car.price.toLocaleString()}
              </span>
            </div>
            {/* Compare Checkbox */}
            {onToggleCompare && (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isCompared}
                  onChange={onToggleCompare}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                Compare
              </label>
            )}
          </div>
          
          <Link
            to={`/cars/${car.id}`}
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-blue-200 dark:shadow-none shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;