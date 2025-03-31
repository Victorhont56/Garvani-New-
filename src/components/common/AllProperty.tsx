import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/app/AuthProvider';
import { ListingCard } from '@/components/common/ListingCard';
import { categoryItems } from './categoryItems';
import { Favorite } from '@/types/profile';

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
  favorites: Favorite[];
}

const AllProperty = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'Rent' | 'Sale' | 'All'>('All');
  const [selectedType, setSelectedType] = useState<'Building' | 'Land' | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filterNavRef = useRef<HTMLDivElement>(null);
  const [mainNavHidden, setMainNavHidden] = useState(false);

  // Hide main navbar when entering this component
  useEffect(() => {
    setMainNavHidden(true);
    return () => setMainNavHidden(false);
  }, []);

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('homes')
          .select(`
            id,
            title,
            price,
            mode,
            type,
            state,
            lga,
            photo,
            category_name,
            favorites!inner(id)
          `);

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
          favorites: item.favorites || []
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

  // Sticky filter navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (filterNavRef.current) {
        if (window.scrollY > 50) {
          filterNavRef.current.classList.add('sticky', 'top-0', 'shadow-md', 'z-10');
          filterNavRef.current.classList.remove('relative');
        } else {
          filterNavRef.current.classList.remove('sticky', 'top-0', 'shadow-md', 'z-10');
          filterNavRef.current.classList.add('relative');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset category when switching to Land type
  useEffect(() => {
    if (selectedType === 'Land') {
      setSelectedCategory(null);
    }
  }, [selectedType]);

  // Filter listings based on selections
  const filteredListings = listings.filter(listing => {
    const modeMatch = selectedMode === 'All' || listing.mode === selectedMode;
    const typeMatch = selectedType === 'All' || listing.type === selectedType;
    const categoryMatch = selectedType === 'Land' ? true : !selectedCategory || listing.category_name === selectedCategory;
    return modeMatch && typeMatch && categoryMatch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sticky filter navbar - now at top since main nav is hidden */}
      <div 
        ref={filterNavRef} 
        className="relative bg-white py-4 px-6 transition-all duration-300 border-b"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mode toggle */}
            <div className="flex items-center space-x-2">
              <span className="font-medium">Mode:</span>
              <div className="flex bg-gray-100 rounded-full p-1">
                {['All', 'Rent', 'Sale'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode === 'All' ? 'All' : mode as 'Rent' | 'Sale')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedMode === mode || (mode === 'All' && selectedMode === 'All')
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Type toggle */}
            <div className="flex items-center space-x-2">
              <span className="font-medium">Type:</span>
              <div className="flex bg-gray-100 rounded-full p-1">
                {['All', 'Building', 'Land'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type === 'All' ? 'All' : type as 'Building' | 'Land');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedType === type || (type === 'All' && selectedType === 'All')
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category chips - only shown for Building type */}
          {selectedType !== 'Land' && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categoryItems.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.label
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>
          )}
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
            <button 
              onClick={() => {
                setSelectedMode('All');
                setSelectedType('All');
                setSelectedCategory(null);
              }}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Reset Filters
            </button>
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
                pathName="/properties"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProperty;