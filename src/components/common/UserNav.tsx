import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { useState } from "react";
import useListModal from "./useListModal";
import useLoginModal from "./useLoginModal";
import useRegisterModal from "./useRegisterModal";
import StatusModal from "./StatusModal";
import { useAuth } from "@/app/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export function UserNav() {
  const { user, isLoading } = useAuth();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const listModal = useListModal();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setShowStatusModal(true);
      setTimeout(() => setShowStatusModal(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <LuMenu className="h-5 w-5 animate-pulse" />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className=""
          >
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
                <Link to="/all-listings" className="w-full">
                  All Listings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:text-white hover:bg-primary">
                <Link to="/my-homes" className="w-full">
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

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        isSuccess={true}
        title="Logged out successfully"
        body={<p className="text-black" >You have been logged out</p>}
      />
    </>
  );
}