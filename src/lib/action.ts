// src/lib/action.ts
import { supabase } from "./supabase/client";
import { ListingCardProps, ListingStatus } from "@/types/profile";

export async function updateListingStatus(
  id: string, 
  status: ListingStatus
): Promise<ListingCardProps> {
  try {
    const { data, error } = await supabase
      .from('homes')
      .update({ status })
      .eq('id', id)
      .select(`
        id,
        title,
        state,
        lga,
        mode,
        price,
        photo,
        category_name,
        status,
        favorites (
          id,
          user_id,
          home_id
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    return transformListingData(data);
  } catch (error) {
    console.error('Error updating listing status:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update listing status');
  }
}

export async function deleteListing(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('homes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete listing');
  }
}

export async function getHome(userId: string): Promise<ListingCardProps[]> {
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
        status,
        favorites (
          id,
          user_id,
          home_id
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (homes || []).map(transformListingData);
  } catch (error) {
    console.error('Error fetching homes:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch homes');
  }
}

// Helper function to transform raw data to ListingCardProps
function transformListingData(home: any): ListingCardProps {
  return {
    id: home.id,
    title: home.title || 'No title',
    price: Number(home.price) || 0,
    mode: home.mode || 'Rent',
    state: home.state || 'Unknown',
    lga: home.lga || 'Unknown',
    photo: home.photo || null,
    category_name: home.category_name,
    status: home.status || 'inactive', // Default status
    favorites: (home.favorites || []).map((fav: any) => ({
      id: fav.id,
      user_id: fav.user_id,
      home_id: fav.home_id
    }))
  };
}