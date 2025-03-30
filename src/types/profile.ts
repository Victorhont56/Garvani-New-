// src/types/profile.ts
export type Profile = {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  

  export interface HomeData {
    user_id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    mode: string;
    state: string;
    lga: string;
    photo: string | null;
    images: string[];
    bathrooms: string;
    added_category: boolean;
    added_description: boolean;
    category_name?: string;
    bedrooms?: string;
    livingrooms?: string;
  }