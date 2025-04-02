// src/app/my-listings/page.tsx
import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ListingCard } from "@/components/common/ListingCard";
import { NoItems } from "@/components/common/NoItem";
import { useAuth } from "@/app/AuthProvider";
import { useEffect, useState } from "react";
import { getHome } from "@/lib/action";
import { ListingCardProps } from "@/types/profile";
import ListModal from "@/components/common/ListModal";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import useListModal from "@/components/common/useListModal";
import { useNavigate } from "react-router-dom";

const MyListings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ListingCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listModal = useListModal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomes = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const homes = await getHome(user.id);
        setData(homes);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load homes');
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, [user]);

  if (authLoading) return <div className="p-4 text-center">Checking authentication...</div>;
  if (loading) return <div className="p-4 text-center">Loading your homes...</div>;
  if (error) return (
    <div className="p-4 text-center text-red-500">
      <p>Error loading homes:</p>
      <p className="font-medium">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <section className="container mx-auto mt-[70px] px-4 sm:px-6 lg:px-8 py-12">
          {/* Header with buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Property Portfolio</h1>
              <p className="text-gray-600 mt-2">
                {data.length} {data.length === 1 ? 'property' : 'properties'} listed
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <FiArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              
              <Button 
                onClick={listModal.onOpen}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <FiPlus className="h-4 w-4" />
                New Listing
              </Button>
            </div>
          </div>

          {/* Content */}
          {data.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <NoItems
                description="Get started by listing your first property on Garvani to see it appear here"
                title="Your property portfolio is empty"
              />
              <Button 
                onClick={listModal.onOpen}
                className="mt-6 flex items-center gap-2 mx-auto bg-primary hover:bg-primary/90"
                size="lg"
              >
                <FiPlus className="h-4 w-4" />
                List Your First Property
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {data.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  userId={user?.id ?? ""}
                  pathName="/my-listings"
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Global components */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18D619',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
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
        }} 
      />
      <ListModal />
      <Footer />
    </div>
  );
};

export default MyListings;