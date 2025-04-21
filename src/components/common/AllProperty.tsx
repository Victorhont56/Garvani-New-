import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/app/AuthProvider';
import { ListingCard } from '@/components/common/ListingCard';
import { SearchModal } from '@/components/common/SearchModal';
import { FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import useSearchModal from '@/components/common/useSearchModal';

interface Listing {
  id: string;
  title: string;
  price: number;
  mode: 'Rent' | 'Sale';
  type: 'Building' | 'Land';
  state: string;
  lga: string;
  photo: string | null;
  category_name?: string;
  favorites: any[];
  status: 'pending' | 'active' | 'rejected' | 'inactive';
}

const AllPropertySection = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchModal = useSearchModal();
  const [filters, setFilters] = useState({
    mode: 'All',
    type: 'All',
    category: null,
    state: null,
    lga: null,
    priceRange: [0, 10000000] as [number, number]
  });

  // Fetch all ACTIVE listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('homes')
          .select('*')
          .eq('status', 'active'); // Only fetch active listings
    
        if (error) throw error;
    
        const typedListings: Listing[] = (data || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          mode: item.mode,
          type: item.type,
          state: item.state,
          lga: item.lga,
          photo: item.photo,
          category_name: item.category_name,
          favorites: item.favorites || [],
          status: item.status || 'inactive'
        }));
    
        setListings(typedListings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on selections
  const filteredListings = listings.filter(listing => {
    const modeMatch = filters.mode === 'All' || listing.mode === filters.mode;
    const typeMatch = filters.type === 'All' || listing.type === filters.type;
    const categoryMatch = filters.type === 'Land' ? true : !filters.category || listing.category_name === filters.category;
    const stateMatch = !filters.state || listing.state === filters.state;
    const lgaMatch = !filters.lga || listing.lga === filters.lga;
    const priceMatch = listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1];
    
    return modeMatch && typeMatch && categoryMatch && stateMatch && lgaMatch && priceMatch;
  });

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
            <div className='mt-[100px]'>
        <div className="sticky top-[60px] z-40 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center py-4">
              <div className="font-bold text-2xl leading-tight">
                All Listings
              </div>
              <Button 
                onClick={searchModal.onOpen}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <FiSearch className="h-4 w-4" />
                Search & Filter
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No listings found matching your criteria</h3>
              <Button 
                onClick={() => {
                  setFilters({
                    mode: 'All',
                    type: 'All',
                    category: null,
                    state: null,
                    lga: null,
                    priceRange: [0, 10000000]
                  });
                }}
                className="mt-4"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className='flex items-center justify-center'>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    item={{
                      id: listing.id,
                      title: listing.title,
                      price: listing.price,
                      mode: listing.mode,
                      state: listing.state,
                      lga: listing.lga,
                      photo: listing.photo || '',
                      favorites: listing.favorites,
                      status: listing.status
                    }}
                    userId={user?.id || ''}
                    pathName="/listing/:id"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <SearchModal onApplyFilters={handleApplyFilters} />
      </div>
    </div>
  );
};

export default AllPropertySection;