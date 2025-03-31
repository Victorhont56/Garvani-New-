// src/App.tsx
import './index.css'
import { Navbar } from './components/common/Navbar'
import HeroSection from './components/common/Hero'
import Footer from './components/common/Footer'
import ListModal from './components/common/ListModal'
import LoginModal from './components/common/LoginModal'
import RegisterModal from './components/common/RegisterModal'
import { useState, useEffect } from 'react'
import AuthProvider from './app/AuthProvider'
import HeroTwo from './components/common/HeroTwo'
import { Outlet } from 'react-router-dom';
import StepsComponent from "@/components/common/StepsComponent";
import WhyChooseUs from './components/common/WhyChooseUs'
import AllProperty from './components/common/AllProperty'



interface AppProps {
  children?: React.ReactNode;  // Add this line
}

// src/App.tsx
export default function App({ children }: AppProps) {
  const [searchParams, setSearchParams] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams({
      filter: params.get('filter') || undefined,
      state: params.get('state') || undefined,
    });
    setLoading(false);
  }, []);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <HeroSection />
        <HeroTwo/>
        <WhyChooseUs/>
        <StepsComponent />
        <AllProperty/>
        <ListModal />
        <RegisterModal />
        <LoginModal />
        
        <main className="flex-grow">
          <Outlet /> {/* This renders the matched child route */}
        </main>

        <Footer />
      </div>
      {children}
    </AuthProvider>
  );
}