// Defines the structure of a Car object expected from the API
export interface Car {
  id: string | number;
  name?: string;
  title?: string;
  brand?: string;
  make?: string;
  model: string;
  year: number;
  price: number;
  image?: string;
  imageUrl?: string;
  location?: string;
  description?: string;
  fuelType?: string;
  transmission?: string;
  mileage?: number;
}

// Normalized Car interface for internal app use
export interface CarNormalized {
  id: string | number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string; // Main image
  images: string[]; // Gallery
  location: string;
  description: string;
  // Extended fields for better UI
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  mileage: number;
}

export type SortOption = 'price_asc' | 'price_desc' | 'year_newest' | 'year_oldest' | 'mileage_low' | 'mileage_high';