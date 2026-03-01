export const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir","Ladakh",
  "Lakshadweep","Puducherry"
];

export const PROPERTY_TYPES = [
  "Flat","Villa","Independent House","Resort","PG","Hostel",
  "Farmhouse","Cottage","Studio Apartment","Penthouse","Bungalow","Other"
];

export const FURNISHING_TYPES = ["Fully Furnished","Semi Furnished","Unfurnished"];

export interface PropertyListItem {
  id: string;
  title: string;
  state: string;
  city: string;
  area: string;
  property_type: string;
  asking_price: number;
  furnishing_type: string;
  monthly_revenue?: number;
  expected_roi?: number;
  images?: string[];
  owner_name?: string;
  created_at: string;
}

export interface Property extends PropertyListItem {
  carpet_area?: number;
  built_up_area?: number;
  occupancy_rate?: number;
  amenities?: string[];
  description: string;
  owner_phone: string;
  owner_email: string;
}

export interface Requirement {
  id: string;
  state: string;
  city: string;
  property_type: string;
  budget_min: number;
  budget_max: number;
  expected_monthly_revenue?: number;
  minimum_roi?: number;
  area_size?: number;
  furnishing_type?: string;
  description: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  created_at: string;
}

export interface PropertyFilters {
  state?: string;
  city?: string;
  property_type?: string;
  price_min?: number;
  price_max?: number;
  revenue_min?: number;
  roi_min?: number;
  furnishing_type?: string;
}