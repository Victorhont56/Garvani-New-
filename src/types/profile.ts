// src/types/profile.ts
export type Profile = {
  id: string;
  email: string;
  avatar_url?: string | null; 
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
  favorites?: Favorite[];
  status: ListingStatus;
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
  size?: number;
  features?: string[];
  year_built?: number | null;
  updated_at?: Date | string;
  status: ListingStatus;
  created_by: string;
  reviewed_by?: string | null;
  rejection_reason?: string | null;
  profile?: Profile; // Add this for the joined profile data
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface User {
  id: string;
  avatar_url: string | null;
  created_at: string | null; // <- make it nullable
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  updated_at: string | null;
  is_admin: boolean;
  user_roles?: {
    is_admin?: boolean;
  }[];
}


export type ListingStatus = "pending" | "active" | "rejected" | "inactive";