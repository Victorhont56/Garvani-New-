import { LuBedSingle, LuBedDouble } from "react-icons/lu";
import { LiaBedSolid, LiaWarehouseSolid } from "react-icons/lia";
import { IoMan } from "react-icons/io5";
import { GiFamilyHouse, GiCastle, GiBarn } from "react-icons/gi";
import { MdOutlineOtherHouses } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import { FaShop, FaHouseUser } from "react-icons/fa6";
import { PiFarmDuotone } from "react-icons/pi";
import { BsFillHousesFill } from "react-icons/bs";
import { IconType } from "react-icons/lib";

interface iAppProps {
  label: string;
  description: string;
  id: number;
  icon: IconType;
}

export const categoryItems: iAppProps[] = [
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
