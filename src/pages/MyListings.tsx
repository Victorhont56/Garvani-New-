// src/app/my-listings/page.tsx
import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ListingCard } from "@/components/common/ListingCard";
import { NoItems } from "@/components/common/NoItem";
import { useAuth } from "@/app/AuthProvider";
import { useEffect, useState } from "react";
import { getHome } from "@/lib/action";
import { ListingCardProps } from "@/types/profile";

const MyListings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ListingCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        className="mt-2 px-4 py-2 bg-secondary text-white rounded"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div>
      <Navbar />
      <section className="container mx-auto px-5 lg:px-10 mb-10 mt-[150px]">
        <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>

        {data.length === 0 ? (
          <NoItems
            description="Please list a home on Garvani so that you can see it right here"
            title="You don't have any Homes listed"
          />
        ) : (
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
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
      <Footer />
    </div>
  );
};

export default MyListings;