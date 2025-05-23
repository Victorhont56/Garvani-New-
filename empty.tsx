// src/app/all-listings/page.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/app/AuthProvider';
import { ListingCard } from '@/components/common/ListingCard';
import { SearchModal } from '@/components/common/SearchModal';
import { FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
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

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        console.log('Fetching listings...');
        const { data, error } = await supabase
          .from('homes')
          .select('*'); // Start with simplest query
    
        if (error) throw error;
    
        console.log('Fetched data:', data);
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
          favorites: item.favorites || []
        }));
    
        console.log('Processed listings:', typedListings);
        setListings(typedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
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
      {/* Search Button */}
      <div className="flex flex-row justify-between items-center gap-4 sticky top-0 bg-white py-4 px-6 shadow-sm z-10 mt-[80px]">
        <div className='font-bold text-2xl leading-tight '>
          All Listings
          
        </div>
        <div>
          <div className="max-w-7xl mx-auto ">
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

      {/* Listings grid */}
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
                  favorites: listing.favorites
                }}
                userId={user?.id || ''}
                pathName="/listing/:id"
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal 
        onApplyFilters={handleApplyFilters}
      />
      <Footer/>
    </div>
  );
};

export default AllProperty;// src/app/all-listings/page.tsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/app/AuthProvider';
import { ListingCard } from '@/components/common/ListingCard';
import { SearchModal } from '@/components/common/SearchModal';
import { FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
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
}

const AllProperty = () => {
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

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        console.log('Fetching listings...');
        const { data, error } = await supabase
          .from('homes')
          .select('*'); // Start with simplest query
    
        if (error) throw error;
    
        console.log('Fetched data:', data);
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
          favorites: item.favorites || []
        }));
    
        console.log('Processed listings:', typedListings);
        setListings(typedListings);
      } catch (err) {
        console.error('Error fetching listings:', err);
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
      <Navbar/>
      {/* Search Button */}
      <div className="flex flex-row justify-between items-center gap-4 sticky top-0 bg-white py-4 px-6 shadow-sm z-10 mt-[80px]">
        <div className='font-bold text-2xl leading-tight '>
          All Listings
          
        </div>
        <div>
          <div className="max-w-7xl mx-auto ">
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

      {/* Listings grid */}
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
                  favorites: listing.favorites
                }}
                userId={user?.id || ''}
                pathName="/listing/:id"
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal 
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default AllPropertySection;