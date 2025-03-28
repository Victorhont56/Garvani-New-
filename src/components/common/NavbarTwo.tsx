import { UserNav } from "./UserNav";
import { MapFilterItems } from "./MapFilterItems";
import { SearchModalComponentTwo } from "./SearchComponentTwo";
import { Link } from "react-router-dom";

export function NavbarTwo() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-4 text-black">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl">Garvani</div>
        </Link>

        <SearchModalComponentTwo />

        <UserNav />
      </div>

      <div className="text-black">
        <MapFilterItems />
      </div>
    </nav>
  );
}