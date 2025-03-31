import { motion } from "framer-motion";
import { IoHomeOutline } from "react-icons/io5";
import { FaKey, FaSearchDollar, FaHandHoldingUsd } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi";
import { MdSell } from "react-icons/md";

const HeroTwo = () => {
  const services = [
    {
      title: "Rent a Home",
      description: "Find your perfect rental property",
      icon: <FaKey className="w-12 h-12 sm:w-16 sm:h-16" />,
      gradient: "from-[#FF9A9E] to-[#FAD0C4]",
      shadow: "shadow-[#FF9A9E]/30",
    },
    {
      title: "Buy a Property",
      description: "Discover your dream home",
      icon: <GiHouseKeys className="w-12 h-12 sm:w-16 sm:h-16" />,
      gradient: "from-[#A1C4FD] to-[#C2E9FB]",
      shadow: "shadow-[#A1C4FD]/30",
    },
    {
      title: "Sell a Property",
      description: "Get the best value for your property",
      icon: <MdSell className="w-12 h-12 sm:w-16 sm:h-16" />,
      gradient: "from-[#FFECD2] to-[#FCB69F]",
      shadow: "shadow-[#FCB69F]/30",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">
          We Have Got You Covered
        </h2>
        <p className="mt-4 text-xl sm:text-2xl text-gray-600 font-medium">
          What You Can Do
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover="hover"
            className={`bg-gradient-to-br ${service.gradient} rounded-2xl p-8 shadow-lg hover:shadow-xl ${service.shadow} transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-6 h-64 sm:h-80`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-full"
            >
              {service.icon}
            </motion.div>
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-white/90">{service.description}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-colors"
            >
              Explore
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroTwo;