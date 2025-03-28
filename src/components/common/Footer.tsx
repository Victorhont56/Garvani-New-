
import { FaFacebookF, FaInstagram, FaTimes, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (

  <div>
    <footer className="bg-secondary text-white font-sans py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className='flex items-center gap-4 justify-between'>
          <h2 className="text-3xl font-bold ">Garvani</h2>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook">
              <FaFacebookF className="text-xl hover:text-gray-400 transition" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-xl hover:text-gray-400 transition" />
            </a>
            <a href="#" aria-label="Close">
              <FaTimes className="text-xl hover:text-gray-400 transition" />
            </a>
            <a href="#" aria-label="TikTok">
              <FaTiktok className="text-xl hover:text-gray-400 transition" />
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-2 text-[12px] leading-normal grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-400 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-400 transition">
                  Website Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition">
                  Legal Agreement
                </a>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-400 transition">
                  Complaints
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div> 
          <div className='flex items-center justify-center text-[12px]'>
            <span>Garvani Ltd 2025 All right reserved.</span>
          </div>
        </div>  
      </div>
    </footer>
    </div>
  );
};

export default Footer;
