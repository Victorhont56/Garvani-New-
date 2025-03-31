import { motion } from "framer-motion";
import { FaShieldAlt, FaChartLine, FaHandshake, FaUserTie, FaHome, FaMoneyBillWave } from "react-icons/fa";
import { GiHouseKeys } from "react-icons/gi";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Trusted Expertise",
      description: "With over 15 years in the market, we've helped thousands find their perfect property",
      icon: <FaShieldAlt className="w-8 h-8" />,
      gradient: "from-[#6a11cb] to-[#2575fc]",
    },
    {
      title: "Best Market Prices",
      description: "Our AI-powered pricing ensures you always get the best deal",
      icon: <FaChartLine className="w-8 h-8" />,
      gradient: "from-[#11998e] to-[#38ef7d]",
    },
    {
      title: "Personalized Service",
      description: "Dedicated agents who understand your unique needs",
      icon: <FaUserTie className="w-8 h-8" />,
      gradient: "from-[#fc4a1a] to-[#f7b733]",
    },
    {
      title: "End-to-End Support",
      description: "From search to signing, we're with you every step",
      icon: <GiHouseKeys className="w-8 h-8" />,
      gradient: "from-[#8e2de2] to-[#4a00e0]",
    },
    {
      title: "Premium Listings",
      description: "Exclusive access to off-market and luxury properties",
      icon: <FaHome className="w-8 h-8" />,
      gradient: "from-[#e65c00] to-[#F9D423]",
    },
    {
      title: "Transparent Fees",
      description: "No hidden charges - what you see is what you pay",
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      gradient: "from-[#11998e] to-[#38ef7d]",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
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
    <div className="relative overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#38ef7d]" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6a11cb] to-[#2575fc] mb-4">
            Why Choose Garvani
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference of working with Nigeria's most innovative real estate platform
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover="hover"
              className={`bg-gradient-to-br ${benefit.gradient} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-default h-full`}
            >
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-white/90 mb-6">{benefit.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-colors border border-white/20"
              >
                Learn more
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-6">
            Ready to experience the Garvani difference?
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Browse Properties
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#6a11cb] font-bold rounded-full shadow-lg hover:shadow-xl border-2 border-[#6a11cb] transition-all"
            >
              Speak to an Agent
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;