import { IoHomeOutline } from "react-icons/io5";

const HeroTwo = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-4xl mt-[70px] sm:text-5xl md:text-6xl font-bold mb-12 md:mb-20 text-center">
                We Have Got You Covered
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-7xl px-4">
                {/* Rent a Home Container */}
                <div className="bg-[#f3dafa] shadow-xl w-full max-w-xs sm:max-w-sm md:w-80 lg:w-96 h-48 sm:h-56 md:h-64 
                              flex flex-col items-center justify-center gap-4 md:gap-6 p-4
                              transition-all duration-300 ease-in-out cursor-pointer
                              hover:scale-105 hover:shadow-2xl hover:shadow-[#f3dafa]/50">
                    <div className="text-gray-300">
                        <IoHomeOutline className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl text-center">
                        Rent a home
                    </div>
                </div>
                
                {/* Buy a Property Container */}
                <div className="bg-[#affab0] shadow-xl w-full max-w-xs sm:max-w-sm md:w-80 lg:w-96 h-48 sm:h-56 md:h-64 
                              flex flex-col items-center justify-center gap-4 md:gap-6 p-4
                              transition-all duration-300 ease-in-out cursor-pointer
                              hover:scale-105 hover:shadow-2xl hover:shadow-[#affab0]/50">
                    <div className="text-gray-300">
                        <IoHomeOutline className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl text-center">
                        Buy a Property
                    </div>
                </div>
                
                {/* Sell a Property Container */}
                <div className="bg-[#cfbffa] shadow-xl w-full max-w-xs sm:max-w-sm md:w-80 lg:w-96 h-48 sm:h-56 md:h-64 
                              flex flex-col items-center justify-center gap-4 md:gap-6 p-4
                              transition-all duration-300 ease-in-out cursor-pointer
                              hover:scale-105 hover:shadow-2xl hover:shadow-[#cfbffa]/50">
                    <div className="text-gray-300">
                        <IoHomeOutline className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl text-center">
                        Sell a Property
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroTwo;