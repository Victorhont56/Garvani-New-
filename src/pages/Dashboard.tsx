// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/AuthProvider';
import {Profile} from '@/types/profile'
import { Navbar } from '@/components/common/Navbar';
import { LuImagePlus } from "react-icons/lu";
import { MdForwardToInbox } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { GoShield } from "react-icons/go";
import { FaChartLine } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import Footer from '@/components/common/Footer';
import ListModal from '@/components/common/ListModal';
import useListModal from '@/components/common/useListModal';



const Dashboard = () => {
  const { user, supabase } = useAuth();
  const listModal = useListModal();
  const [userData, setUserData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (supabaseError) throw supabaseError;
        setUserData(data as Profile);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, supabase]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <Navbar /> 
      <div className="mt-[100px] mb-[100px]"> 
         
             {/** Header **/}
        <div className='flex flex-col gap-4 border border-gray-200 rounded-xl shadow-lg w-[80%] mx-auto px-6 py-2'>
          <div className="">
            <h1 className='text-[30px]'>Welcome,  {userData?.first_name && <span> {userData.first_name} {userData.last_name}</span>}</h1>
            <h1 className='text-[15px]'>Glad to see you back! </h1>
          </div>  
          {/** Icons **/}
          <div className=''>
            <div className='flex flex-row justify-between'>
              <div className='flex flex-col items-center justify-center cursor-pointer'>
                <span><MdForwardToInbox size={22} /></span>
                <span className='text-[12px] hidden sm:inline'>Inbox</span>
              </div>
              <div className='flex flex-col items-center justify-center cursor-pointer'>
                <span><SlCalender size={17} /></span>
                <span className='text-[12px] hidden sm:inline'>Calendar</span>
              </div>
              <div className='flex flex-col items-center justify-center cursor-pointer'>
                <span><GoShield size={17}/></span>
                <span className='text-[12px] hidden sm:inline'>Verify</span>
              </div>
              <div className='flex flex-col items-center justify-center cursor-pointer'>
                <span><FaChartLine size={17}/></span>
                <span className='text-[12px] hidden sm:inline'>Analytics</span>
              </div>
              <div className='flex flex-col items-center justify-center cursor-pointer'>
                <span><FaRegBell size={17}/></span>
                <span className='text-[12px] hidden sm:inline'>Notifications</span>
              </div>
            </div>
          </div>
        </div>


         <section className="private-content mt-[20px] flex flex-col gap-8">
            
            {/** Listing section **/}
          <div className="border border-gray-200 rounded-xl shadow-lg w-[90%] mx-auto px-6 py-">
            <div className='flex flex-col gap-2 py-4'>
                <p className='text-[25px]'>Your Listings</p>
                <p className='text-[15px]'>You have 0 listings</p>
                
                {/** image preview **/}
                <div>
                    <div className='bg-gray-100 w-[150px] h-[110px] border border-gray-200 rounded-sm shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:bg-gray-200' onClick={listModal.onOpen}>
                    <div className='text-gray-300'>
                        <LuImagePlus size={30} />
                    </div >
                        <div className='text-gray-500'>
                        Add a new listing
                        </div>
                        
                    </div>
                </div>
            </div>
           </div>
            {/** favourite section **/}
          <div className="border border-gray-200 rounded-xl shadow-lg w-[90%] mx-auto px-6 py-">
            <div className='flex flex-col gap-2 py-4'>
                <p className='text-[25px]'>Your Favorites</p>
                <p className='text-[15px]'>You have 0 favorites</p>
                
                {/** image preview **/}
                <div >
                    <div className='bg-gray-100 w-[150px] h-[110px] border border-gray-200 rounded-sm shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:bg-gray-200'>
                    <div className='text-gray-300'>
                        <LuImagePlus size={30} />
                    </div >
                        <div className='text-gray-500'>
                        Add to favorites
                        </div>
                        
                    </div>
                </div>
            </div>
           </div>
            {/** Reservation section **/}
          <div className="border border-gray-200 rounded-xl shadow-lg w-[90%] mx-auto px-6 py-">
            <div className='flex flex-col gap-2 py-4'>
                <p className='text-[25px]'>Your Reservations</p>
                <p className='text-[15px]'>You have 0 reservations</p>
                
                {/** image preview **/}
                <div>
                    <div className='bg-gray-100 w-[150px] h-[110px] border border-gray-200 rounded-sm shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:bg-gray-200'>
                    <div className='text-gray-300'>
                        <LuImagePlus size={30} />
                    </div >
                        <div className='text-gray-500'>
                        Add to reservations
                        </div>
                        
                    </div>
                </div>
            </div>
           </div>

        </section>
      </div>
      <Footer/>
      <ListModal /> 
    </div>
  );
};

export default Dashboard;