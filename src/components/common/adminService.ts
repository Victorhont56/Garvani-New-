// adminService.ts
import { supabase, isAdmin } from "@/lib/supabase/client";
import { HomeData, ListingStatus, Notification } from "@/types/profile";

export class AdminService {
  // Fetch listings by status
  static async getListingsByStatus(
    status: ListingStatus
  ): Promise<HomeData[]> {
    const { data, error } = await supabase
      .from("homes")
      .select("*")
      .eq("status", status);

    if (error) throw new Error(error.message);
    return data as HomeData[];
  }

  // Approve a listing
  static async approveListing(
    listingId: string,
    adminUserId: string
  ): Promise<void> {
    if (!(await isAdmin(adminUserId))) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { error } = await supabase
      .from("homes")
      .update({ 
        status: "active",
        reviewed_by: adminUserId 
      })
      .eq("id", listingId);

    if (error) throw new Error(error.message);
  }

  // Reject a listing
  static async rejectListing(
    listingId: string,
    adminUserId: string,
    reason: string
  ): Promise<void> {
    if (!(await isAdmin(adminUserId))) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Update listing status
    const { error: listingError } = await supabase
      .from("homes")
      .update({ 
        status: "rejected",
        rejection_reason: reason 
      })
      .eq("id", listingId);

    if (listingError) throw new Error(listingError.message);

    // Send notification
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: listingOwnerId, // Fetch this from the listing
        message: `Your listing was rejected. Reason: ${reason}`
      });

    if (notificationError) throw new Error(notificationError.message);
  }
}