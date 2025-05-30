import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";
import { useEffect, useState } from "react";
import { SearchModalComponentTwo } from "./SearchModalComponentTwo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed shadow-lg top-0 left-0 w-full h-[80px] z-50 transition-all duration-300 bg-gradient-to-r from-[#fbe5f1] to-[#c095fb]`}>
      <div className={`flex items-center justify-between container mx-auto px-5 lg:px-10 py-4`}>
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl">Garvani</div>
        </Link>
        <SearchModalComponentTwo />
        <UserNav />
      </div>
    </nav>
  );
}
