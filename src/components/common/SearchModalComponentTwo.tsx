import { Search } from "lucide-react";
import useSearchModal from "./useSearchModal";


export function SearchModalComponentTwo() {
  const searchModal = useSearchModal ();

  return (
    <div className="rounded-full py-2 px-5 border-0 sm:border flex items-center cursor-pointer">
      {/* Menu Links - Hidden on Mobile, Visible on Medium and Large */}
      <div className="hidden sm:flex gap-3 font-medium transition-colors duration-300">
        {["Home", "Discover", "About", "Contact", "Settings"].map((label, idx) => (
          <a
            key={idx}
            href="#"
            className="text-black hover:text-gray-600" // Always black text
          >
            {label}
          </a>
        ))}
      </div>

      {/* Search Icon - Visible Only on Medium and Larger */}
      <div className="sm:flex ml-14" onClick={searchModal.onOpen}>
       
            <Search
              className="bg-primary text-white p-1 h-8 hover:bg-hover hover:text-white w-8 rounded-full" // Always black text
            />
         
      </div>
    </div>
  );
}