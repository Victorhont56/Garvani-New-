// src/lib/action.ts
import { supabase } from "./supabase/client";
import { ListingCardProps } from "@/types/profile";

// src/lib/action.ts
export async function getHome(id: string): Promise<ListingCardProps[]> {
    try {
      const { data: homes, error } = await supabase
        .from('homes')
        .select(`
          id,
          title,
          state,
          lga,
          mode,
          price,
          photo,
          category_name,
          favorites (
            id,
            user_id,
            home_id
          )
        `)
        .eq('user_id', id);
  
      if (error) throw error;
  
      return (homes || []).map(home => ({
        id: home.id,
        title: home.title || 'No title',
        price: Number(home.price) || 0,
        mode: home.mode || 'Rent',
        state: home.state || 'Unknown',
        lga: home.lga || 'Unknown',
        photo: home.photo || null,
        category_name: home.category_name,
        favorites: (home.favorites || []).map(fav => ({
          id: fav.id,
          user_id: fav.user_id,
          home_id: fav.home_id
        }))
      }));
    } catch (error) {
      console.error('Error in getHome:', error);
      throw error;
    }
  }