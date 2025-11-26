import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCarDetails, fetchCars } from '../services/api';
import { CarNormalized } from '../types';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import ContactModal from '../components/ContactModal';
import Toast from '../components/Toast';
import CarCard from '../components/CarCard';
import LoanCalculator from '../components/LoanCalculator';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [car, setCar] = useState<CarNormalized | null>(null);
  const [similarCars, setSimilarCars] = useState<CarNormalized[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', visible: false });

  useEffect(() => {
    if (id) {
      loadDetails(id);
      window.scrollTo(0, 0);
    }
  }, [id]);

  const loadDetails = async (carId: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch current car
      const data = await fetchCarDetails(carId);
      setCar(data);
      setActiveImage(data.image);

      // 2. Fetch all cars to calculate "Similar Vehicles"
      const allCars = await fetchCars();
      const recommended = allCars.filter(c => 
        c.id != data.id && 
        (c.brand === data.brand || (Math.abs(c.price - data.price) < 10000))
      ).slice(0, 3);
      setSimilarCars(recommended);

    } catch (err) {
      setError("Failed to load car details. It might have been removed or the ID is invalid.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = () => {
    setIsModalOpen(false);
    setToast({ msg: 'Inquiry sent successfully! The seller will contact you soon.', visible: true });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({ msg: 'Link copied to clipboard!', visible: true });
  };

  if (loading) return <Loader />;
  if (error || !car) return <ErrorState message={error || 'Car not found'} onRetry={() => id && loadDetails(id)} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toast message={toast.msg} isVisible={toast.visible} onClose={() => setToast({...toast, visible: false})} />
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleContactSubmit}
        carTitle={car.title}
      />

      {/* Breadcrumb / Back */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm group"
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-full mr-2 group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </div>
          Back to Listings
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          Share
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Col: Gallery */}
        <div className="lg:col-span-8 space-y-4">
          <div className="aspect-w-16 aspect-h-9 w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm relative group">
            <img
              src={activeImage}
              alt={car.title}
              className="w-full h-full object-cover transition-transform duration-700"
            />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {car.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative rounded-xl overflow-hidden h-24 border-2 transition-all ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
           {/* Description Section */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Vehicle Description</h3>
            <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p>{car.description}</p>
              <p className="mt-4">
                Equipped with {car.transmission} transmission and powered by a {car.fuelType} engine. 
                This {car.year} {car.brand} {car.model} is available now in {car.location}.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Details & Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex items-center gap-2 mb-4">
                 <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">
                    {car.brand}
                 </span>
                 <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wide">
                    Verified
                 </span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">{car.title}</h1>
            <p className="flex items-center text-gray-500 dark:text-gray-400 font-medium mb-6">
               <svg className="w-5 h-5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               {car.location}
            </p>

            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
               ${car.price.toLocaleString()}
            </div>
            <p className="text-gray-400 text-sm mb-6">Excluding taxes & fees</p>

             <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6 mb-6">
                 <div>
                   <div className="text-gray-400 text-xs uppercase font-bold mb-1">Year</div>
                   <div className="font-semibold text-gray-800 dark:text-gray-200">{car.year}</div>
                 </div>
                 <div>
                   <div className="text-gray-400 text-xs uppercase font-bold mb-1">Mileage</div>
                   <div className="font-semibold text-gray-800 dark:text-gray-200">{car.mileage.toLocaleString()} mi</div>
                 </div>
                 <div>
                   <div className="text-gray-400 text-xs uppercase font-bold mb-1">Fuel</div>
                   <div className="font-semibold text-gray-800 dark:text-gray-200">{car.fuelType}</div>
                 </div>
                 <div>
                   <div className="text-gray-400 text-xs uppercase font-bold mb-1">Transmission</div>
                   <div className="font-semibold text-gray-800 dark:text-gray-200">{car.transmission}</div>
                 </div>
              </div>

            <div className="space-y-3">
               <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
               >
                 Contact Seller
               </button>
               <button className="w-full bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold py-3 px-8 rounded-xl transition-colors">
                 Schedule Test Drive
               </button>
            </div>
          </div>

          {/* Calculator Widget */}
          <LoanCalculator carPrice={car.price} />
        </div>
      </div>

      {/* Recommendations */}
      {similarCars.length > 0 && (
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar Vehicles You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map(similar => (
              <CarCard key={similar.id} car={similar} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;