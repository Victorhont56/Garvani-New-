// src/types/profile.ts
export type Profile = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export interface Favorite {
  id: string;
  user_id: string;
  home_id: string;
}

export interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  mode: string;
  state: string;
  lga: string;
  photo: string | null;
  category_name?: string;
  favorites: Favorite[];
}

export interface HomeData extends ListingCardProps {
  user_id: string;
  description: string;
  type: string;
  images: string[];
  bathrooms: string;
  added_category: boolean;
  added_description: boolean;
  bedrooms?: string;
  livingrooms?: string;
  created_at: Date | string;
  
  address?: string;
  size?: number; // in sqft
  features?: string[];
  year_built?: number;
  updated_at?: Date | string;

}