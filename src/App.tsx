// src/App.tsx
import './index.css'
import { Navbar } from './components/common/Navbar'
import HeroSection from './components/common/Hero'
import Footer from './components/common/Footer'
import ListModal from './components/common/ListModal'
import LoginModal from './components/common/LoginModal'
import RegisterModal from './components/common/RegisterModal'
import { ListingsContainer } from './components/common/ListingsContainer'
import { SkeltonCard } from './components/common/SkeletonCard'
import { useState, useEffect } from 'react'
import AuthProvider from './app/AuthProvider'

interface AppProps {
  children?: React.ReactNode;  // Add this line
}

export default function App({ children }: AppProps) {  // Modify this line
  const [searchParams, setSearchParams] = useState<Record<string, string | undefined>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchParams({
      filter: params.get('filter') || undefined,
      state: params.get('state') || undefined,
      // ... other params
    })
    setLoading(false)
  }, [])

  return (
  <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <HeroSection />
        <ListModal />
        <RegisterModal />
        <LoginModal />
        
        <main className="flex-grow">
          {loading ? (
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <SkeltonCard key={index} />
              ))}
            </div>
          ) : (
            <ListingsContainer searchParams={searchParams} />
          )}
        </main>

        <Footer />
      </div>
      {children}  {/* Add this line to render children */}
   </AuthProvider>

  )
}