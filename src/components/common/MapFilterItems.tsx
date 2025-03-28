import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { LuBedSingle, LuBedDouble } from "react-icons/lu";
import { LiaBedSolid, LiaWarehouseSolid } from "react-icons/lia";
import { IoMan } from "react-icons/io5";
import { GiFamilyHouse, GiCastle, GiBarn } from "react-icons/gi";
import { MdOutlineOtherHouses } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import { FaShop, FaHouseUser, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { PiFarmDuotone } from "react-icons/pi";
import { BsFillHousesFill } from "react-icons/bs";
import { useRef } from "react";
import qs from "query-string";

export const categoryItems = [
  { id: 0, label: "Single-Room", icon: LuBedSingle, description: "This is a single room apartment" },
  { id: 1, label: "Room-and-Parlour", icon: LuBedDouble, description: "This is a one bedroom and parlour apartment" },
  { id: 2, label: "2-Bedroom-Flat", icon: LiaBedSolid, description: "This is a two bedroom apartment" },
  { id: 3, label: "Self-contain", icon: IoMan, description: "This is a self-contain" },
  { id: 4, label: "Duplex", icon: BiBuildingHouse, description: "This is a duplex" },
  { id: 5, label: "Storey-building", icon: GiFamilyHouse, description: "This is a storey Building" },
  { id: 6, label: "Bungalow", icon: MdOutlineOtherHouses, description: "This is a bungalow" },
  { id: 7, label: "Stylish", icon: GiCastle, description: "This property is stylish" },
  { id: 8, label: "Semi-Detached", icon: BsFillHousesFill, description: "This property is semi-detached" },
  { id: 9, label: "Detached", icon: BiBuildingHouse, description: "This property is detached" },
  { id: 10, label: "Commercial", icon: FaShop, description: "This property is for commercial purpose" },
  { id: 11, label: "Residential", icon: FaHouseUser, description: "This property is for residential purpose" },
  { id: 12, label: "Storage", icon: GiBarn, description: "This property is for storage" },
  { id: 13, label: "Agriculture", icon: PiFarmDuotone, description: "This property is for agriculture" },
  { id: 14, label: "Warehouse", icon: LiaWarehouseSolid, description: "This is a warehouse" },
];

export function MapFilterItems() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = qs.parse(location.search);
  const search = queryParams.filter as string | undefined;
  const containerRef = useRef<HTMLDivElement>(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const newQueryParams = { ...queryParams, [name]: value };
      return qs.stringify(newQueryParams, { skipNull: true });
    },
    [queryParams]
  );

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex mb-3 font-bold items-center">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 text-black z-10 p-2 mx-4 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <FaChevronLeft size={12} />
      </button>

      {/* Category Container */}
      <div
        ref={containerRef}
        className="flex items-center overflow-x-scroll no-scrollbar scroll-smooth space-x-4 px-10"
      >
        {categoryItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => navigate(`${location.pathname}?${createQueryString("filter", label)}`)}
            className={cn(
              search === label
                ? "border-b-2 border-black pb-2 flex-shrink-0"
                : "opacity-70 flex-shrink-0",
              "flex flex-col gap-y-3 hover:text-primary items-center bg-transparent border-none cursor-pointer"
            )}
          >
            <div className="relative w-6 h-6">
              <Icon size={28} />
            </div>
            <p className="text-xs font-medium">{label}</p>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 text-black z-10 p-2 mx-4 bg-white rounded-full shadow-md hover:bg-gray-100"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
}