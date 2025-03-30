import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ListingCard } from "@/components/common/ListingCard";
import { NoItems } from "@/components/common/NoItem";
import { useAuth } from "@/app/AuthProvider";
import { useEffect, useState } from "react";

interface Listing {
  id: string;
  title: string;
  state: string | null;
  lga: string | null;
  mode: string | null;
  price: number | null;
  photo: string | null;
  Favorite: Array<{ id: string }>;
}

const MyListings = () => {
  const { user, supabase, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data: listings, error } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            state,
            lga,
            mode,
            price,
            photo,
            Favorite (id)
          `)
          .eq('userId', user.id);

        if (error) throw error;
        setData(listings || []);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, supabase]);

  if (authLoading || loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <section className="container mx-auto px-5 lg:px-10 my-10">
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
                imagePath={item.photo ?? ""}
                title={item.title ?? ""}
                state={item.state ?? ""}
                lga={item.lga ?? ""}
                mode={item.mode ?? ""}
                price={item.price ?? 0}
                userId={user?.id ?? ""}
                pathName="/my-homes"
                favoriteId={item.Favorite[0]?.id}
                homeId={item.id}
                isInFavoriteList={item.Favorite.length > 0}
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