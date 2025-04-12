import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLoginModal from "@/components/common/useLoginModal";
import { toast } from "react-hot-toast";
import LoginModal from "@/components/common/LoginModal";

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

const LoginPage = () => {
  const loginModal = useLoginModal();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle email confirmation redirect
  useEffect(() => {
    if (location.search.includes('confirmed=true')) {
      loginModal.onOpen();
      toast.success('Email confirmed successfully! Please login.');
      // Clear the query param
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, loginModal]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Garvani</h1>
          <p className="text-gray-200">Find your dream home with us</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {!loginModal.isOpen && (
            <div className="px-6 py-8">
              <button
                onClick={() => loginModal.onOpen()}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Login to Your Account
              </button>
            </div>
          )}

          <LoginModal />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Garvani Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;