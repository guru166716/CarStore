import React, { useState, useEffect, useMemo } from 'react';
import { fetchCars } from '../services/api';
import { CarNormalized, SortOption } from '../types';
import CarCard from '../components/CarCard';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import Toast from '../components/Toast';
import CompareBar from '../components/CompareBar';
import CompareModal from '../components/CompareModal';

const Home: React.FC = () => {
  const [cars, setCars] = useState<CarNormalized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortOption, setSortOption] = useState<SortOption | ''>('');
  
  // UI States
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState<{msg: string, visible: boolean}>({ msg: '', visible: false });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Comparison State
  const [compareList, setCompareList] = useState<CarNormalized[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    loadCars();
    const savedFavs = localStorage.getItem('car_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const loadCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      setError("We couldn't load the car listings. Please check your connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(fid => fid !== id);
      setToast({ msg: 'Removed from favorites', visible: true });
    } else {
      newFavs = [...favorites, id];
      setToast({ msg: 'Added to favorites', visible: true });
    }
    setFavorites(newFavs);
    localStorage.setItem('car_favorites', JSON.stringify(newFavs));
  };

  const toggleCompare = (car: CarNormalized) => {
    const exists = compareList.find(c => c.id === car.id);
    if (exists) {
      setCompareList(compareList.filter(c => c.id !== car.id));
    } else {
      if (compareList.length >= 3) {
        setToast({ msg: 'You can only compare up to 3 vehicles.', visible: true });
        return;
      }
      setCompareList([...compareList, car]);
    }
  };

  // Extract unique values for sidebar
  const brands = useMemo(() => Array.from(new Set(cars.map(c => c.brand))).sort(), [cars]);
  const fuelTypes = useMemo(() => Array.from(new Set(cars.map(c => c.fuelType))).sort(), [cars]);

  // Main Filter Logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand);
      const matchFuel = selectedFuel.length === 0 || selectedFuel.includes(car.fuelType);
      const matchPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchSearch && matchBrand && matchFuel && matchPrice;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'year_newest': return b.year - a.year;
        case 'year_oldest': return a.year - b.year;
        case 'mileage_low': return a.mileage - b.mileage;
        case 'mileage_high': return b.mileage - a.mileage;
        default: return 0;
      }
    });
  }, [cars, searchTerm, selectedBrands, selectedFuel, priceRange, sortOption]);

  const handleCheckbox = (value: string, current: string[], setter: any) => {
    if (current.includes(value)) setter(current.filter(i => i !== value));
    else setter([...current, value]);
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={loadCars} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Toast 
        message={toast.msg} 
        isVisible={toast.visible} 
        onClose={() => setToast({...toast, visible: false})} 
      />

      <CompareModal 
        isOpen={isCompareModalOpen}
        cars={compareList}
        onClose={() => setIsCompareModalOpen(false)}
      />

      <CompareBar 
        selectedCars={compareList}
        onRemove={(id) => setCompareList(compareList.filter(c => c.id !== id))}
        onClear={() => setCompareList([])}
        onCompare={() => setIsCompareModalOpen(true)}
      />

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
           <button 
             onClick={() => setShowMobileFilters(!showMobileFilters)}
             className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-3 rounded-lg font-medium text-gray-700 dark:text-gray-200"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
             {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
           </button>
        </div>

        {/* Sidebar Filters */}
        <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-8 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 h-fit sticky top-24 transition-colors`}>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filter By</h3>
            
            {/* Brands */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Make</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleCheckbox(brand, selectedBrands, setSelectedBrands)}
                    />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Max Price</h4>
              <input 
                type="range" 
                min="0" 
                max="150000" 
                step="5000" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>$0</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">${priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Fuel Type</h4>
              <div className="space-y-2">
                {fuelTypes.map(fuel => (
                  <label key={fuel} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      checked={selectedFuel.includes(fuel)}
                      onChange={() => handleCheckbox(fuel, selectedFuel, setSelectedFuel)}
                    />
                    <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>
            
             <button 
              onClick={() => { setSelectedBrands([]); setSelectedFuel([]); setPriceRange([0, 200000]); }}
              className="mt-6 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 mt-6 lg:mt-0">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
             <div className="relative w-full sm:max-w-md">
               <input
                type="text"
                className="block w-full pl-4 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                placeholder="Search by make, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
             </div>

             <div className="flex items-center gap-2 w-full sm:w-auto">
               <label className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Sort by:</label>
               <select
                  className="block w-full sm:w-48 py-2.5 px-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                >
                  <option value="">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_newest">Newest First</option>
                  <option value="year_oldest">Oldest First</option>
                  <option value="mileage_low">Mileage: Low to High</option>
                  <option value="mileage_high">Mileage: High to Low</option>
                </select>
             </div>
          </div>

          {/* Results Info */}
          <div className="mb-4">
             <span className="font-semibold text-gray-900 dark:text-white">{filteredCars.length}</span> <span className="text-gray-500 dark:text-gray-400">Cars Available</span>
          </div>

          {/* Grid */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No cars found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedBrands([]); setSelectedFuel([]); setPriceRange([0, 200000]); }}
                className="mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  isFavorite={favorites.includes(Number(car.id))}
                  onToggleFavorite={(e) => { e.preventDefault(); toggleFavorite(Number(car.id)); }}
                  isCompared={!!compareList.find(c => c.id === car.id)}
                  onToggleCompare={() => toggleCompare(car)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;