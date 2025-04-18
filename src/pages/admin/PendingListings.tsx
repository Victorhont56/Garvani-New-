import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkAdminStatus } from "@/lib/supabase/admin";
import { useAuth } from "@/app/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FiHome, FiCheck, FiX, FiEye } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { HomeData, ListingStatus } from "@/types/profile";
import { TbCurrencyNaira } from "react-icons/tb";



export default function PendingListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<HomeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const isAdmin = await checkAdminStatus(user.id);
        if (!isAdmin) navigate("/");
      } else {
        navigate("/login");
      }
    };
    verifyAdmin();
  }, [user, navigate]);

  useEffect(() => {
    const fetchPendingListings = async () => {
      try {
        // First fetch pending homes
        const { data: homesData, error: homesError } = await supabase
          .from('homes')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (homesError) throw homesError;
        if (!homesData) return;

        // Get all user IDs for these homes
        const userIds = homesData.map(home => home.user_id);
        const homeIds = homesData.map(home => home.id);

        // Fetch associated profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Fetch favorites for these homes
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('*')
          .in('home_id', homeIds);

        if (favoritesError) throw favoritesError;

        // Transform the data into HomeData format
        const formattedData = homesData.map(home => {
          const profile = profilesData?.find(p => p.id === home.user_id);
          const homeFavorites = favoritesData?.filter(f => f.home_id === home.id) || [];

          return {
            // ListingCardProps
            id: home.id,
            title: home.title || '',
            price: home.price || 0,
            mode: home.mode || '',
            state: home.state || '',
            lga: home.lga || '',
            photo: home.photo || null,
            category_name: home.category_name || undefined,
            favorites: homeFavorites.map(fav => ({
              id: fav.id,
              user_id: fav.user_id || '',
              home_id: fav.home_id || ''
            })),

            // HomeData specific
            user_id: home.user_id,
            description: home.description || '',
            type: home.type || '',
            images: home.images || [],
            bathrooms: home.bathrooms || '',
            added_category: home.added_category || false,
            added_description: home.added_description || false,
            bedrooms: home.bedrooms || undefined,
            livingrooms: home.livingrooms || undefined,
            created_at: home.created_at ? new Date(home.created_at) : new Date(),
            address: home.address || undefined,
            size: home.size || undefined,
            features: home.features || [],
            year_built: home['year-built'] || null,
            updated_at: home.updated_at ? new Date(home.updated_at) : undefined,
            status: home.status as ListingStatus,
            created_by: home.user_id, // Using user_id as created_by
            reviewed_by: home.reviewed_by || null,
            rejection_reason: home.rejection_reason || null,
            profile: profile ? {
              id: profile.id,
              email: profile.email || '',
              avatar_url: profile.avatar_url || undefined,
              first_name: profile.first_name || undefined,
              last_name: profile.last_name || undefined
            } : undefined
          };
        });

        setListings(formattedData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingListings();
  }, []);

  const handleStatusChange = async (id: string, status: 'active' | 'rejected', reason?: string) => {
    const { error } = await supabase
      .from('homes')
      .update({ 
        status,
        reviewed_by: user?.id,
        rejection_reason: reason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pending Listings</h1>
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
          {listings.length} pending approval
        </Badge>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FiHome className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No pending listings</h3>
            <p className="mt-1 text-sm text-gray-500">All listings have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FiHome className="text-indigo-500" />
                    {listing.title}
                  </CardTitle>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="outline">{listing.type}</Badge>
                    <Badge variant="outline">{listing.mode}</Badge>
                    <Badge variant="outline">{listing.state}</Badge>
                  </div>
                </div>
                <Tooltip content={`Submitted by ${listing.profile?.email}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={listing.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {listing.profile?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Tooltip>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Bedrooms: {listing.bedrooms || 'N/A'}</p>
                    <p>Bathrooms: {listing.bathrooms || 'N/A'}</p>
                    <p className="flex flex-row gap-1"><span>Price: </span><span className= "flex flex-row items-center"><TbCurrencyNaira />{listing.price?.toLocaleString() || 'N/A'}</span></p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {listing.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={() => handleStatusChange(listing.id, 'active')}
                  >
                    <FiCheck className="mr-2" /> Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) handleStatusChange(listing.id, 'rejected', reason);
                    }}
                  >
                    <FiX className="mr-2" /> Reject
                  
                    </Button>
                    <Link to={`/listing/${listing.id}`}>
                    <Button variant="outline" className="w-full"
                    
                    >
                      <FiEye className="mr-2" /> View Details
                    </Button>
                    </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}