// src/App.tsx
import './index.css'
import { Navbar } from './components/common/Navbar'
import HeroSection from './components/common/Hero'
import Footer from './components/common/Footer'
import ListModal from './components/common/ListModal'
import LoginModal from './components/common/LoginModal'
import RegisterModal from './components/common/RegisterModal'
import { useState, useEffect } from 'react'
import HeroTwo from './components/common/HeroTwo'
import { Outlet } from 'react-router-dom'
import StepsComponent from "@/components/common/StepsComponent"
import WhyChooseUs from './components/common/WhyChooseUs'
import AllProperty from './components/common/AllProperty'
import { Toaster } from 'react-hot-toast'

interface AppProps {
  children?: React.ReactNode;
}

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <HeroTwo/>
      <WhyChooseUs/>
      <StepsComponent />
      <AllProperty/>
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
      {children}
      
      <ListModal />
      <LoginModal />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            zIndex: 9999,
            background: '#18D619',
            color: '#fff',
            fontWeight: 'bold',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4e82e3',
              secondary: 'white',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }}
      />
      <RegisterModal />
    </div>
  );
}