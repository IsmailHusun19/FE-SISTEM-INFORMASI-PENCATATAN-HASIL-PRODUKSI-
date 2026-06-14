import {
  Home,
  Users,
  LogOut,
  User,
  PackageSearch,
  Settings,
  UserCog,
  Notebook,
  Factory,
  CalendarCog,
  Activity,
  CheckCircle,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./SlideBar";
import React from "react";
import { Logout } from "../service/Api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const MenuSlideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await Logout();
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isFeedbackActive = currentPath.startsWith("/admin/pengguna/feedback");
  const isPenggunaActive =
    currentPath.startsWith("/admin/pengguna") && !isFeedbackActive;

  const userRole = user?.role;
  const sidebarItems = [
    {
      icon: <Home size={20} />,
      text: "Home",
      to: "/dashboard",
      active: currentPath === "/dashboard",
      roles: ["OPERATOR_PRODUKSI", "KETUA_REGU", "ADMIN", "UNIT_HEAD"],
    },
    {
      icon: <Users size={20} />,
      text: "Pengguna",
      to: "/pengguna",
      active: isPenggunaActive,
      roles: ["ADMIN"],
      children: ["Unit Head", "Ketua Regu", "Operator Produksi"],
    },
    {
      icon: <PackageSearch size={20} />,
      text: "Produk",
      to: "/produk",
      active: currentPath.includes("/produk"),
      roles: ["ADMIN"],
    },
    {
      icon: <Settings size={20} />,
      text: "Mesin",
      to: "/mesin",
      active: isFeedbackActive,
      roles: ["ADMIN"],
    },
    {
      icon: <UserCog size={20} />,
      text: "Line",
      to: "/line",
      active: currentPath.includes("/shift"),
      roles: ["ADMIN"],
    },
    {
      icon: <CheckCircle size={20} />,
      text: "Approval Produksi",
      to: "/approval-produksi",
      active: currentPath.includes("/approval-produksi"),
      roles: ["UNIT_HEAD"],
    },
    
    {
      icon: <Activity size={20} />,
      text: "Monitoring",
      to: "/monitoring",
      active: currentPath.includes("/monitoring"),
      roles: ["ADMIN", "UNIT_HEAD"],
    },

    {
      icon: <Notebook size={20} />,
      text: "Laporan",
      to: "/laporan",
      active: currentPath.includes("/laporan"),
      roles: ["ADMIN", "UNIT_HEAD"],
    },

    {
      icon: <Factory size={20} />,
      text: "Produksi",
      to: "/produksi",
      active: currentPath === "/produksi",
      roles: ["KETUA_REGU"],
    },

    {
      icon: <CalendarCog size={20} />,
      text: "Log Mesin",
      to: "/log-mesin",
      active: currentPath === "/log-mesin",
      roles: ["OPERATOR_PRODUKSI"],
    },

    {
      icon: <User size={20} />,
      text: "Profile",
      to: "/profile",
      active: currentPath === "/admin/profile",
      roles: ["OPERATOR_PRODUKSI", "KETUA_REGU", "ADMIN", "UNIT_HEAD"],
    },

    {
      icon: <LogOut size={20} />,
      text: "Logout",
      onClick: handleLogout,
      roles: ["OPERATOR_PRODUKSI", "KETUA_REGU", "ADMIN", "UNIT_HEAD"],

    },
  ];

  return (
    <div className="flex">
      <Sidebar>
        {sidebarItems.map((item) => {
          if (!item.roles || item.roles.includes(userRole)) {
            return (
              <React.Fragment key={item.text}>
                {item.text === "Profile" && (
                  <hr className="my-3 border-gray-700" />
                )}

                <SidebarItem
                  icon={item.icon}
                  text={item.text}
                  to={item.to}
                  active={item.active}
                  onClick={item.onClick}
                >
                  {item.children?.map((child) => child)}
                </SidebarItem>
              </React.Fragment>
            );
          }
          return null;
        })}
      </Sidebar>

      <div className="w-full h-16 border-b border-b-gray-900 flex justify-end items-center">
        <div className="relative font-[sans-serif] mx-auto w-[95%] m-auto flex justify-end">
          <div className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm">
            <img
              src={user.avatar ? `http://localhost:3000/${user.avatar}` : "https://readymadeui.com/profile_6.webp"}
              className="w-8 h-8 mr-3 rounded-full shrink-0 object-cover object-center"
              alt="Profile"
            />
            <h1 className="whitespace-nowrap overflow-hidden text-gray-200 font-bold text-ellipsis max-w-[10ch] lg:max-w-max">
              {user?.name || "User"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSlideBar;
