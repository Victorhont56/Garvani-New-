import { motion } from "framer-motion";
import { User, FileText, Home } from "lucide-react";
import useRegisterModal  from "./useRegisterModal"; // Import your modal hook

const StepsComponent = () => {
  const registerModal = useRegisterModal(); // Initialize the modal hook
  
  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up in less than 2 minutes with just your email",
      icon: <User className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Complete Your KYC",
      description: "Verify your identity for security purposes",
      icon: <FileText className="w-8 h-8" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Post Your Property",
      description: "List your property and reach potential buyers/renters",
      icon: <Home className="w-8 h-8" />,
      color: "bg-green-100 text-green-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Get Started in 3 Simple Steps
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Join thousands of happy property owners
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover="hover"
            className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${step.color} relative overflow-hidden`}
          >
            {/* Step number */}
            <div className="absolute top-4 right-4 text-4xl font-bold opacity-10">
              0{index + 1}
            </div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: index * 0.1 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${step.color.replace("bg-", "bg-opacity-30 ")}`}
            >
              {step.icon}
            </motion.div>

            {/* Content */}
            <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-700 mb-6">{step.description}</p>

            {/* Animated connector (except last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="w-16 h-1 bg-gray-300 origin-left"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500"
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Beautiful CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center my-[100px] "
      >
        <div className="h-[400px] bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl flex flex-col items-center justify-center">
          <h3 className="text-2xl sm:text-3xl font-medium text-gray-800 px-6">
            Ready to begin your real estate journey?
          </h3>
          <motion.button
            onClick={registerModal.onOpen} // Open register modal on click
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 mt-[30px] bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default StepsComponent;