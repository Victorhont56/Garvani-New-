'use client';
import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";
import { SearchModalComponent } from "./SearchComponent";
import { MapFilterItems } from "./MapFilterItems";
import { useEffect, useState } from "react";

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
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
      ${isScrolled ? "bg-white/60 backdrop-blur-md shadow-md" : "bg-transparent"}`}>
      
      <div className={`flex items-center justify-between container mx-auto px-5 lg:px-10 py-4 
        ${isScrolled ? "text-black" : "text-white"}`}>

        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl">Garvani</div>
        </Link>

        <SearchModalComponent isScrolled={isScrolled} />


        <UserNav />
      </div>

      <div className={`${isScrolled ? "text-black" : "text-white"} transition-colors duration-300`}>
        <MapFilterItems />
      </div>
    </nav>
  );
}
