// components/HeroSection.jsx or HeroSection.tsx
import { Link } from "react-router-dom";

export default function HeroSection() {
    return (
      <div
        className="relative bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('/src/assets/hero-2.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <div className=' mt-[70px]'>  
              <h4 className="text-white text-lg">
                Simple and Transparent Real Estate Platform
              </h4>
              <h1 className="text-white text-4xl md:text-6xl font-bold mt-4">
                Find and List Properties<br />
                with no <span className="text-primary italic">hassle</span>
              </h1>
              <p className="text-white mt-4 max-w-xl">
                We bring you the perfect way to find residential and commercial properties effortlessly, seamless, reliable, and stress-free.
              </p>
              <Link to="/sign-up" className="w-full">
                <button className="relative mt-6 bg-gradient-to-b from-[#fbe5f1] to-[#affab0] text-secondary font-semibold py-2 px-6 rounded-full overflow-hidden">
                  <span className="absolute inset-0 bg-[#fb89e7] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10">Get Started</span>
                </button>
              </Link>
            </div>    
        </div>
      </div>
    );
  }
  