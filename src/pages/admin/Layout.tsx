import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX, FiHome, FiList, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/app/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { showErrorToast, showSuccessToast } from "@/utils/toast";


export default function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "pending-listings", icon: <FiList size={20} />, label: "Listings" },
    { path: "users", icon: <FiUsers size={20} />, label: "Users" },
    { path: "settings", icon: <FiSettings size={20} />, label: "Settings" },
  ];

   const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        showSuccessToast('Logged out successfully');
        navigate("/");
      } else {
        showErrorToast('Failed to log out');
      }
    };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-lg">
        <div className="flex items-center justify-center h-16 px-4 border-b border-indigo-700">
          <div className="flex items-center space-x-2">
            <FaShieldAlt className="text-indigo-300" size={24} />
            <span className="text-xl font-bold">Garvani Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
           <Link
           key={item.path}
           to={`/admin/${item.path}`}
           className="flex items-center px-4 py-3 rounded-lg transition-all hover:bg-indigo-700 hover:shadow-md"
           >
            <span className="mr-3 text-indigo-200">{item.icon}</span>
            <span>{item.label}</span>
           </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-indigo-300">Administrator</p>
            </div>
          </div>
          <button className="mt-4 w-full flex items-center justify-center space-x-2 text-indigo-200 hover:text-white"
                   onClick={handleLogout}
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white shadow-xl"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-indigo-300" size={24} />
                <span className="text-xl font-bold">Garvani Admin</span>
              </div>
              <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-md hover:bg-indigo-700">
                <FiX size={24} />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-1">
              {navItems.map((item) => (
               <Link
                  key={item.path}
                  to={`/admin/${item.path}`}
                  className="flex items-center px-4 py-3 rounded-lg transition-all hover:bg-indigo-700 hover:shadow-md"
                >
                  <span className="mr-3 text-indigo-200">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button 
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <FiMenu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <span>3</span>
                  </div>
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}