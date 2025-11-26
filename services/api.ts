import { CarNormalized } from '../types';

const BASE_URL = 'https://apicars.prisms.in';

// Enhanced Mock data
const MOCK_CARS: CarNormalized[] = [
  {
    id: 1,
    title: "Honda Civic Sport",
    brand: "Honda",
    model: "Civic",
    year: 2022,
    price: 24500,
    image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "New York, NY",
    description: "A reliable and sporty compact sedan with excellent fuel economy and modern features.",
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: 12000
  },
  {
    id: 2,
    title: "Tesla Model 3 Long Range",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 48000,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "San Francisco, CA",
    description: "Electric performance sedan with autopilot capabilities and minimal interior.",
    fuelType: 'Electric',
    transmission: 'Automatic',
    mileage: 5000
  },
  {
    id: 3,
    title: "Ford Mustang GT",
    brand: "Ford",
    model: "Mustang",
    year: 2021,
    price: 38000,
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "Austin, TX",
    description: "American muscle car with a powerful V8 engine and aggressive styling.",
    fuelType: 'Petrol',
    transmission: 'Manual',
    mileage: 25000
  },
  {
    id: 4,
    title: "Toyota RAV4 Hybrid",
    brand: "Toyota",
    model: "RAV4",
    year: 2022,
    price: 32000,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "Denver, CO",
    description: "Versatile SUV with hybrid efficiency and all-wheel drive capability.",
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    mileage: 18000
  },
  {
    id: 5,
    title: "BMW 3 Series",
    brand: "BMW",
    model: "330i",
    year: 2023,
    price: 45000,
    image: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "Miami, FL",
    description: "Luxury sports sedan offering a perfect balance of comfort and driving dynamics.",
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: 8000
  },
  {
    id: 6,
    title: "Porsche 911 Carrera",
    brand: "Porsche",
    model: "911",
    year: 2020,
    price: 115000,
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "Los Angeles, CA",
    description: "Iconic sports car with timeless design and unmatched performance.",
    fuelType: 'Petrol',
    transmission: 'Automatic',
    mileage: 15000
  },
  {
    id: 7,
    title: "Rivian R1T",
    brand: "Rivian",
    model: "R1T",
    year: 2024,
    price: 73000,
    image: "https://images.unsplash.com/photo-1678235213608-250917036d6a?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "Seattle, WA",
    description: "The ultimate electric adventure truck with incredible off-road capabilities.",
    fuelType: 'Electric',
    transmission: 'Automatic',
    mileage: 1200
  },
  {
    id: 8,
    title: "Volkswagen Golf GTI",
    brand: "Volkswagen",
    model: "Golf",
    year: 2019,
    price: 28000,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80",
    images: [],
    location: "Chicago, IL",
    description: "The quintessential hot hatch, practical yet incredibly fun to drive.",
    fuelType: 'Petrol',
    transmission: 'Manual',
    mileage: 42000
  }
];

const normalizeCar = (data: any): CarNormalized => {
  // Logic to determine mocked attributes if API doesn't provide them
  const fuel = data.fuelType || (data.title?.includes('Electric') ? 'Electric' : data.title?.includes('Hybrid') ? 'Hybrid' : 'Petrol');
  const trans = data.transmission || 'Automatic';
  const mainImage = data.image || data.imageUrl || `https://picsum.photos/seed/${data.id}/800/600`;
  
  // Generate mock gallery images
  const images = [
    mainImage,
    `https://picsum.photos/seed/${data.id}side/800/600`,
    `https://picsum.photos/seed/${data.id}rear/800/600`,
    `https://picsum.photos/seed/${data.id}int/800/600`,
  ];

  return {
    id: data.id,
    title: data.title || data.name || `${data.brand || data.make || 'Unknown'} ${data.model || ''}`,
    brand: data.brand || data.make || 'Generic',
    model: data.model || 'Unknown',
    year: parseInt(data.year) || new Date().getFullYear(),
    price: parseFloat(data.price) || 0,
    image: mainImage,
    images: images,
    location: data.location || data.city || 'Available Online',
    description: data.description || 'No description available for this vehicle.',
    fuelType: fuel,
    transmission: trans,
    mileage: data.mileage || Math.floor(Math.random() * 50000) + 1000
  };
};

export const fetchCars = async (): Promise<CarNormalized[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${BASE_URL}/cars`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.data || []);
    return list.map(normalizeCar);
  } catch (error) {
    console.warn("API Connection Issue: Using local mock data.", error);
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CARS.map(normalizeCar)), 800);
    });
  }
};

export const fetchCarDetails = async (id: string | number): Promise<CarNormalized> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${BASE_URL}/cars/${id}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    const carData = data.data ? data.data : data;
    return normalizeCar(carData);
  } catch (error) {
     console.warn("API Connection Issue: Using local mock details.", error);
    const mockCar = MOCK_CARS.find(c => c.id == id);
    if (mockCar) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(normalizeCar(mockCar)), 500);
      });
    }
    throw error;
  }
};