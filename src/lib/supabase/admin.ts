import { supabase } from "./client";

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_with_roles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data.is_admin;
};