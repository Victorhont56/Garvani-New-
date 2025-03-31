import { useEffect, useState } from "react";
import { ListingCard } from "../components/common/ListingCard";
import CategoryCarousal from "../components/common/CategoryCarousal";
import { SearchModalComponentThree } from "../components/common/SearchComponentThree";
import { FaPlus } from "react-icons/fa6";
import { supabase } from "@/lib/supabase/client";
import { Favorite } from "@/types/profile";

interface Listing {
  id: string;
  photo: string;
  title: string;
  state: string;
  lga: string;
  mode: string;
  type: string;
  price: number;
  favorites: Favorite[];
}

export default function AllListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [mode, setMode] = useState<"Rent" | "Sale">("Rent");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/listings?mode=${mode}`);
        const data = await response.json();
        
        // Transform the data to match our types
        const transformedData = data.map((listing: any) => ({
          ...listing,
          favorites: listing.Favorite ? listing.Favorite.map((fav: any) => ({
            id: fav.id,
            user_id: fav.userId, // Map userId to user_id
            home_id: listing.id  // Set home_id from listing.id
          })) : []
        }));
        
        setListings(transformedData);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      }
    };
  
    fetchListings();
  }, [mode, selectedCategory]);

  const filteredListings = selectedCategory
    ? listings.filter((listing) => listing.type === selectedCategory)
    : listings;

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex justify-center px-4">
        <div className="fixed flex flex-col top-[80px] bg-white z-[100] w-full pt-5 px-4">
          <h1 className="text-3xl font-bold mb-[10px]">All Listings</h1>

          <div className="flex flex-row justify-between items-center mb-[20px]">
            {/* Toggle Button */}
            <div className="flex flex-start">
              <button
                onClick={() => setMode("Rent")}
                className={`flex justify-center px-6 py-2 rounded-l-lg w-[70px] h-[30px] items-center ${
                  mode === "Rent" ? "bg-secondary text-white" : "bg-gray-200"
                }`}
              >
                Rent
              </button>
              <button
                onClick={() => setMode("Sale")}
                className={`flex justify-center items-center px-6 py-2 rounded-r-lg w-[70px] h-[30px] ${
                  mode === "Sale" ? "bg-secondary text-white" : "bg-gray-200"
                }`}
              >
                Sale
              </button>
            </div>
          
            <button className="bg-primary text-secondary rounded-full px-4 h-[30px]">
              <div className="flex flex-row justify-between items-center gap-4">     
                <span> Add a New Listing</span><span><FaPlus /></span>
              </div>
            </button>
          </div>

          {/* Search Modal */}
          <div className="flex flex-row gap-5 justify-between w-full">
            <div className="w-[70%]">
              <SearchModalComponentThree />
            </div>
        
            <div className="w-[20%] flex items-center justify-center rounded-full bg-secondary px-4 text-white">
              Search
            </div>
          </div>
          
          {/* Category Carousal */}
          <CategoryCarousal
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>  
      </div>  

      {/* Listings Grid */}
      <div className="flex justify-center px-4 mt-[250px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              photo: listing.photo,
              favorites: listing.favorites
            }}
            userId={userId || ''}
            pathName="/all-listings"
          />
        ))}
        </div>
      </div>
    </div>
  );
}