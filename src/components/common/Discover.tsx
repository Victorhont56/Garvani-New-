import { useNavigate } from "react-router-dom";
import { CiCompass1 } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Discover = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="mt-[1px] text-primary hover:text-hover font-bold cursor-pointer">
          <div className="flex flex-col items-center">
            <CiCompass1 size={30} />
            <p className="text-[16px]">Explore</p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[200px] bg-[#F9FAFB] shadow-2xl rounded-xl font-bold z-[1000]"
        align="center"
        sideOffset={12}
      >
        <DropdownMenuItem onClick={() => handleMenuItemClick("/properties")}>
          New Listings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuItemClick("/lands")}>
          Lands
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuItemClick("/luxurious-houses")}>
          Luxurious Houses
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuItemClick("/commercial-buildings")}>
          Commercial Buildings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMenuItemClick("/single-apartments")}>
          Single Apartments
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleMenuItemClick("/shortlets")}>
          Shortlets
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Discover;