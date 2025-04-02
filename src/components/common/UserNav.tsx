import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { useState, useRef, useEffect } from "react";
import useListModal from "./useListModal";
import useLoginModal from "./useLoginModal";
import useRegisterModal from "./useRegisterModal";
import StatusModal from "./StatusModal";
import { useAuth } from "@/app/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { Tooltip } from "@/components/ui/tooltip";
import { FiUpload } from "react-icons/fi";

export function UserNav() {
  const { user, isLoading } = useAuth();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const listModal = useListModal();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) {
        setProfileImage(null);
        return;
      }

      try {
        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.avatar_url) {
          setProfileImage(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [user]); // Run when user changes


  // Get user initials
  const getInitials = () => {
    if (!user) return "";
    const firstNameInitial = user.user_metadata?.first_name?.[0] || "";
    const lastNameInitial = user.user_metadata?.last_name?.[0] || "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) {
      alert('No file selected or user not logged in');
      return;
    }
  
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    // Validate file
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WEBP image');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
  
    setUploading(true);
  
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;
  
      // 1. Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
  
      if (uploadError) throw uploadError;
  
      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
  
      // 3. Update profile - removed updated_at
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          avatar_url: publicUrl,
          email: user.email
        });
  
      if (updateError) throw updateError;
  
      setProfileImage(publicUrl);
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(`Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setShowStatusModal(true);
      setTimeout(() => {
        setShowStatusModal(false);
        navigate("/");
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <Button variant="ghost" size="icon" disabled>
          <LuMenu className="h-5 w-5 animate-pulse" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Welcome, {user.user_metadata?.first_name || "User"}
            </span>
            
            <Tooltip content={profileImage ? "Change profile image" : "Add profile image"} position="bottom">
              <div className="relative group">
                <div 
                  className="relative w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                 {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={() => setProfileImage(null)} // Fallback to initials if image fails to load
                  />
                ) : (
                  <span className="font-medium">{getInitials()}</span>
                )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiUpload className="text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </Tooltip>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="">
              <LuMenu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] z-[5000] bg-gradient-to-b from-white via-[#fbe5f1] to-[#affab0]">
            {user ? (
              <>
                <DropdownMenuItem
                  className="hover:text-white hover:bg-primary"
                  onClick={() => listModal.onOpen()}
                >
                  <button type="button" className="w-full text-start">
                    Add a new Listing
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:text-white hover:bg-primary">
                  <Link to="/dashboard" className="w-full">
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:text-white hover:bg-primary">
                  <Link to="/all-listings" className="w-full">
                    View all Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:text-white hover:bg-primary">
                  <Link to="/my-listings" className="w-full">
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:text-white hover:bg-primary">
                  <Link to="/favorites" className="w-full">
                    My Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:text-white hover:bg-primary">
                  <Link to="/reservations" className="w-full">
                    My Reservations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <Button
                    onClick={loginModal.onOpen}
                    variant="outline"
                    className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                  >
                    Sign In
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    onClick={registerModal.onOpen}
                    variant="outline"
                    className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                  >
                    Sign Up
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        isSuccess={true}
        title="Logged out successfully"
        body={<p className="text-black">You have been logged out</p>}
      />
    </>
  );
}