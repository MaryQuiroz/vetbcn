export interface Clinic {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  address: string;
  barrio: string;
  phone: string;
  email: string | null;
  website: string | null;
  rating: number;
  reviewCount: number;
  price: number;
  isEmergency: boolean;
  specialties: string[];
  animalTypes: string[];
  languages: string[];
  hours: Record<string, string> | null;
  imageUrl: string | null;
  lat: number | null;
  lng: number | null;
}
