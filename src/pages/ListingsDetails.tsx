// src/pages/ListingDetails.tsx
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { HomeData } from '@/types/profile'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Navbar } from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { TbCurrencyNaira } from "react-icons/tb";
import RatingsAndReviews from '@/components/reviews/RatingsAndReviews';
import { IoIosArrowForward } from "react-icons/io";



export default function ListingDetails() {
    const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('homes')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setListing(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="error-message">{error}</div>
  if (!listing) return <div>Listing not found</div>


  if (!id) {
    return <div>Invalid listing ID</div>;
  }

  return (
    <div className='bg-background pt-[10px]'>
     <Navbar />
        {/* Header */}
        <div className='font-bold mt-[100px] text-[30px] md:text-[40px] lg:text-[40px] w-[95%]  mx-auto'>
          <div className='mb-[0px]'>Listing Page</div>
          <hr className='mt-[20px]'/>
           {/* Owner Details */}

           <div className='my-[20px]'>
           <div className='flex flex-col items-center justify-center'>
                <div>
                  <div className='w-[50px] h-[50px] rounded-full border-[2px] text-[12px] border-black font-light '>
                    Profile image
                  </div>
                </div>
                <div className='text-[12px] font-medium text-[#6D7280]'>
                   Owner first_name
                </div>
                <div className='text-[12px] font-medium text-[#6D7280]'>
                  Date Posted: 
                </div>
           </div>
           </div>

        </div>
        
        
    <div className=" container mx-auto px-4 py-8 mt-[80px]">

       <div className='bg-[#c0fab6] flex flex-col items-center justify-center gap-4 border border-gray-200 rounded-xl shadow-lg w-[80%] lg:w-[40%] md:w-[60%]  mx-auto px-6 py-2 mb-[100px]'>  
          <h1 className="text-3xl font-bold mb-8">{listing.title}</h1>
       </div>

      {/* Main Image */}
      <div className='bg-white flex flex-col gap-4 border border-gray-200 rounded-xl shadow-lg w-[95%] md:w-[60%] lg:w-[40%] mx-auto px-6 py-2 mb-[60px]'>
         <div className='flex flex-row items-center justify-center'>
          <div className='font-medium text-[#6D7280] mt-[10px]'>Cover Photo</div>
        </div>
        <div>
            {listing.photo && (
                <div className="mb-6">
                <img 
                    src={listing.photo} 
                    alt={listing.title}
                    className="w-full h-96 object-cover rounded-lg"
                />
                </div>   
            )}
       </div>
      </div>

      {/* Additional Images */}
      <div className='bg-white flex flex-col items-center gap-4 border border-gray-200 rounded-xl shadow-lg w-[95%] mx-auto px-6 py-2 mb-[30px]'> 

      <div className='font-medium text-[#6D7280] mt-[10px]'>Photo Gallery</div>

      {listing.images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-4 mb-8">
          

          {listing.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Property image ${index + 1}`}
              className="h-[250px] w-[300px] object-cover rounded-lg"
            />
          ))}
        </div>
      )}
      </div>

      <div className='w-[100%] flex items-center justify-center'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 mb-6">{listing.description}</p>
          
          <h2 className="text-2xl font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Type:</p>
              <p>{listing.type}</p>
            </div>
            <div>
              <p className="font-medium">Mode:</p>
              <p>{listing.mode}</p>
            </div>
            <div>
              <p className="font-medium">State:</p>
              <p>{listing.state}</p>
            </div>
            <div>
              <p className="font-medium">LGA:</p>
              <p>{listing.lga}</p>
            </div>
            {listing.bedrooms && (
              <div>
                <p className="font-medium">Bedrooms:</p>
                <p>{listing.bedrooms}</p>
              </div>
            )}
            {listing.bathrooms && (
              <div>
                <p className="font-medium">Bathrooms:</p>
                <p>{listing.bathrooms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Price and Action Buttons */}
        <div className="border rounded-lg p-6 h-fit sticky top-4  bg-gradient-to-r from-[#fbe5f1] to-[#c095fb]">
          <p className="text-3xl font-bold mb-4 flex items-center"><TbCurrencyNaira/>{listing.price}</p>
          <p className="text-gray-600 mb-6">
            {listing.mode === "Rent" ? "per month" : "total price"}
          </p>
          
          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-hover transition mb-4">
            Contact Owner
          </button>
          
          <button className="w-full border border-secondary text-secondary py-3 rounded-lg font-medium hover:bg-secondary/10 transition">
            Save to Favorites
          </button>
        </div>
      </div>
    </div>
    </div>
    <div className='bg-[#d1f7fb] w-[95%] h-[200px] mx-auto rounded-lg flex items-center justify-center'>

            <div className=' px-[30px] flex flex-row items-center gap-8'>
                <div className='text-[20px] font-medium '> 
                    View all Listings from this Owner 
                </div>
                <div className='bg-secondary px-[10px] py-[5px] rounded-lg text-primary flex flex-row'>
                    <IoIosArrowForward size={30} />
                    <IoIosArrowForward size={30} />
                    <IoIosArrowForward size={30} />
                </div>
            </div>
     </div>

    <div className='mb-[50px] px-[30px]'>
      <RatingsAndReviews homeId={id} />
    </div>
    <Footer />
    </div>
  )
}