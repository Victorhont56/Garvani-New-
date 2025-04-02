import { motion } from "framer-motion";
import useRegisterModal from "./useRegisterModal";

export default function HeroSection() {
  const registerModal = useRegisterModal();
  return (
    <section
      className="relative bg-cover bg-center h-screen w-full"
      style={{ 
        backgroundImage: "url('/src/assets/hero-2.png')",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
      
      {/* Content container */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Tagline */}
          <motion.h4
            className="text-primary text-lg md:text-xl font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Simple and Transparent Real Estate Platform
          </motion.h4>
          
          {/* Main heading */}
          <motion.h1
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Find and List Properties<br className="hidden sm:block" /> with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-hover">
              zero hassle
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p
            className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Discover residential and commercial properties through Africa's most seamless, reliable, and stress-free real estate platform.
          </motion.p>
          
          {/* CTA Button */}

          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div onClick={registerModal.onOpen}>
              <button className="relative group bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
}