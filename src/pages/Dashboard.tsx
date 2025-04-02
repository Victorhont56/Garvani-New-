import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { Profile } from '@/types/profile';
import { Navbar } from '@/components/common/Navbar';
import { LuImagePlus, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MdForwardToInbox } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { GoShield } from "react-icons/go";
import { FaChartLine } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import Footer from '@/components/common/Footer';
import ListModal from '@/components/common/ListModal';
import useListModal from '@/components/common/useListModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';



interface DashboardStats {
  listings: any[];
  favorites: any[];
  reservations: any[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, supabase } = useAuth();
  const listModal = useListModal();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    listings: [],
    favorites: [],
    reservations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const galleryRefs = {
    listings: useRef<HTMLDivElement>(null),
    favorites: useRef<HTMLDivElement>(null),
    reservations: useRef<HTMLDivElement>(null)
  };

  const handleListingClick = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };


  const scrollGallery = (direction: 'left' | 'right', gallery: 'listings' | 'favorites' | 'reservations') => {
    const galleryElement = galleryRefs[gallery].current;
    if (galleryElement) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      galleryElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch listings with main photo
        const { data: listingsData } = await supabase
          .from('homes')
          .select('id, title, photo')
          .eq('user_id', user.id);

        // Fetch favorites with main photo (assuming structure)
        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('id, home_id, homes(id, title, photo)')
          .eq('user_id', user.id);

        // Fetch reservations with main photo (assuming structure)
        const { data: reservationsData } = await supabase
          .from('reservations')
          .select('id, home_id, homes(id, title, photo)')
          .eq('user_id', user.id);

        setUserData(profileData as Profile);
        setStats({
          listings: listingsData || [],
          favorites: favoritesData?.map(fav => fav.homes) || [],
          reservations: reservationsData?.map(res => res.homes) || []
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, supabase]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 mt-[100px]">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 border rounded-xl">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center mt-[100px]">
        <div className="text-center max-w-md p-6 rounded-lg bg-white shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-dark"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-[100px]">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {userData?.first_name} {userData?.last_name}!
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your properties</p>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg">
              {[
                { icon: <MdForwardToInbox size={20} className="text-gray-700" />, label: "Inbox" },
                { icon: <SlCalender size={17} className="text-gray-700" />, label: "Calendar" },
                { icon: <GoShield size={17} className="text-gray-700" />, label: "Verify" },
                { icon: <FaChartLine size={17} className="text-gray-700" />, label: "Analytics" },
                { icon: <FaRegBell size={17} className="text-gray-700" />, label: "Notifications" },
              ].map((item, index) => (
                <button
                  key={index}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors flex flex-col items-center"
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className="text-xs mt-1 text-gray-600 hidden sm:block">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              key: 'listings',
              title: "Your Listings", 
              count: stats.listings.length, 
              description: "Properties you've listed",
              icon: <LuImagePlus size={24} className="text-primary" />,
              action: listModal.onOpen
            },
            { 
              key: 'favorites',
              title: "Your Favorites", 
              count: stats.favorites.length, 
              description: "Properties you've saved",
              icon: <LuImagePlus size={24} className="text-primary" />,
              action: () => {} // Add your favorite action
            },
            { 
              key: 'reservations',
              title: "Your Reservations", 
              count: stats.reservations.length, 
              description: "Upcoming bookings",
              icon: <LuImagePlus size={24} className="text-primary" />,
              action: () => {} // Add your reservation action
            },
          ].map((section) => (
            <div key={section.key} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{section.description}</p>
                  <p className="text-3xl font-bold mt-3">{section.count}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  {section.icon}
                </div>
              </div>
              
              {/* Gallery Preview */}
              <div className="mt-6 relative group">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                  <button 
                    onClick={() => scrollGallery('left', section.key as any)}
                    className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <LuChevronLeft size={20} />
                  </button>
                </div>
                
                <div 
                  ref={galleryRefs[section.key as keyof typeof galleryRefs]}
                  className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
                >
                  {/* Add New Card (always first) */}
                  <div 
                    className="flex-shrink-0 w-40 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={section.action}
                  >
                    <LuImagePlus size={30} className="text-gray-400" />
                    <p className="text-gray-500 text-sm mt-2 text-center">
                      {section.key === 'listings' ? 'Add new listing' : 
                       section.key === 'favorites' ? 'Browse favorites' : 'View reservations'}
                    </p>
                  </div>
                  
                  {/* Listing Previews */}
                  {stats[section.key as keyof typeof stats].map((item: any) => (
                    <div 
                      key={item.id} 
                      className="flex-shrink-0 w-40 h-32 bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer"
                      onClick={() => handleListingClick(item.id)}
                    >
                      {item.photo ? (
                        <img 
                          src={item.photo} 
                          alt={item.title || 'Property'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <LuImagePlus size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium truncate">{item.title || 'Untitled'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                  <button 
                    onClick={() => scrollGallery('right', section.key as any)}
                    className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <LuChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18D619',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4e82e3',
              secondary: 'white',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }} />
      <Footer />
      <ListModal />
    </div>
  );
};

export default Dashboard;