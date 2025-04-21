// src/pages/ListingDetails.tsx
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { HomeData } from '@/types/profile';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Navbar } from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { TbCurrencyNaira } from 'react-icons/tb';
import RatingsAndReviews from '@/components/reviews/RatingsAndReviews';
import { IoIosArrowForward } from 'react-icons/io';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaShare, FaMapMarkerAlt } from 'react-icons/fa';
import { MdApartment, MdHouse, MdVilla } from 'react-icons/md';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ListModal from '@/components/common/ListModal';
import { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at?: string;
}

interface ListingWithOwner extends HomeData {
  owner_profile?: ProfileData | null;
}

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingWithOwner | null>(null);
  const [owner, setOwner] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        
        // 1. First fetch the home data
        const { data: homeData, error: homeError } = await supabase
          .from('homes')
          .select('*')
          .eq('id', id)
          .single();

        if (homeError) throw homeError;
        if (!homeData) throw new Error('Listing not found');

        // 2. Then fetch the owner's profile separately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', homeData.user_id)
          .single();

        // Combine the data
        const completeListing = {
          ...homeData,
          owner_profile: profileData || null
        };

        setListing(completeListing);
        setOwner(profileData || null);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!listing) return <div>Listing not found</div>;
  if (!id) return <div>Invalid listing ID</div>;

  const getPropertyIcon = () => {
    switch (listing.type?.toLowerCase()) {
      case 'apartment':
        return <MdApartment className="text-xl" />;
      case 'house':
        return <MdHouse className="text-xl" />;
      case 'villa':
        return <MdVilla className="text-xl" />;
      default:
        return <MdHouse className="text-xl" />;
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <IoIosArrowForward className="mx-2" />
          <span>Listings</span>
          <IoIosArrowForward className="mx-2" />
          <span className="text-primary">{listing.title}</span>
        </div>

        {/* Property Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Main Image */}
          <div className="md:w-2/3">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
              {listing.photo && (
                <img
                  src={listing.photo}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm">
                  <FaHeart className="text-gray-700" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur-sm">
                  <FaShare className="text-gray-700" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {listing.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[listing.photo, ...listing.images]
                  .filter((img): img is string => !!img) // Type guard to ensure string
                  .slice(0, 4)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative rounded-lg overflow-hidden aspect-square ${
                        activeImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Owner and Price Card */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={owner?.avatar_url} />
                  <AvatarFallback>
                    {owner?.first_name?.[0]}
                    {owner?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    Listed by {owner?.first_name || 'Owner'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Joined{' '}
                    {owner?.created_at
                      ? format(new Date(owner.created_at), 'MMM yyyy')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold flex items-center">
                    <TbCurrencyNaira className="mr-1" />
                    {listing.price.toLocaleString()}
                  </span>
                  {listing.mode === 'Rent' && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {listing.mode === 'Rent' ? 'Rental price' : 'Purchase price'}
                </p>
              </div>

              <div className="space-y-4">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 h-12">
                  <Link 
                    to={`/messages/new?recipient=${listing.user_id}&property=${listing.id}`}
                    state={{ 
                      recipient: owner,
                      property: listing 
                    }}
                  >
                    Contact Owner
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-12">
                  Request Tour
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium mb-3">Property Facts</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <FaBed className="text-gray-400" />
                    <span>{listing.bedrooms || 'N/A'} beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBath className="text-gray-400" />
                    <span>{listing.bathrooms || 'N/A'} baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRulerCombined className="text-gray-400" />
                    <span>{listing.size || 'N/A'} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPropertyIcon()}
                    <span>{listing.type || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            {/* Title and Location */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>
                  {listing.lga}, {listing.state}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Full Gallery */}
            {listing.images?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.images.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{listing.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Type</span>
                  <span className="font-medium">{listing.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date Listed</span>
                  <span className="font-medium">
                    {listing.created_at
                      ? format(new Date(listing.created_at), 'MMM d, yyyy')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{listing.year_built || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">State</span>
                  <span className="font-medium">{listing.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LGA</span>
                  <span className="font-medium">{listing.lga}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More from Owner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                More properties from {owner?.first_name || 'this owner'}
              </h2>
              <p className="text-gray-600">
                Browse other listings from this trusted seller
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2 h-12 px-6">
              View all listings
              <IoIosArrowForward />
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <RatingsAndReviews homeId={id} />
        </div>
      </div>
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
      <ListModal/>
      <Footer />
    </div>
  );
}