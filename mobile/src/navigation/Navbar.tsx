import { INavigationItem, IUser } from "@/utils/types";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiBell, HiCog } from "react-icons/hi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
// ✅ ensure this axios instance exists (like axios.create)

interface INavbarProps {
  user: IUser;
  username?: string | null;
  siteName: string;
  userNavigation: INavigationItem[];
  handleMenuStatus: () => void;
  isOpenMenu: boolean;
}

const Navbar: React.FunctionComponent<INavbarProps> = ({
  user,
  username,
  siteName,
  userNavigation,
  handleMenuStatus,
  isOpenMenu,
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Fetch Notifications Count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // ✅ Get username dynamically from localStorage (fallback: 'kiran')
        const storedUser = localStorage.getItem("userData");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const username = parsedUser?.username || "kiran";

        const res = await api.get(
          `/notifications/user/${encodeURIComponent(username)}`
        );

        if (res.data && Array.isArray(res.data)) {
          setNotifications(res.data);
          console.log("✅ Notifications fetched successfully:", res.data);
        } else {
          console.error("⚠️ Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("🚨 Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleClickMenu = () => {
    handleMenuStatus();
  };

  const userNavigateRender = () =>
    userNavigation.map((menuItem) => (
      <li key={menuItem.name}>
        <Link
          to={menuItem.href}
          className="flex justify-between items-center hover:bg-gray-100 px-2 py-1 rounded-md transition"
        >
          {menuItem.name}
          <span className="badge badge-primary">New</span>
        </Link>
      </li>
    ));
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const firstName = parsedUser?.firstName;
  return (
    <motion.div
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 w-full z-50
      flex justify-between items-center
      bg-gradient-to-l from-[#1E6FBF] from-10% to-transparent
      h-16 md:h-16 lg:h-18
      px-4
      shadow-inner shadow-[#010810]"
    >
      {/* Left - Logo & Menu */}
      <div className="w-fit flex justify-center items-center gap-4">
        <button
          className="btn btn-square btn-xs btn-outline border-black text-black hover:bg-black hover:text-white transition"
          onClick={handleClickMenu}
        >
          {!isOpenMenu ? (
            <HiMenu className="w-3 h-3" />
          ) : (
            <HiX className="w-3 h-3" />
          )}
        </button>

        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/images/companylogo.png"
            className="h-10 sm:h-12 cursor-pointer hover:scale-105 transition"
            alt="ems"
          />
        </Link>
      </div>

      {/* Right side */}
      <div className="flex justify-between items-center gap-x-1">
        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            onClick={() => navigate("/station-operations/moc/notifications")} // ✅ navigate on click
            className="btn btn-ghost btn-circle hover:bg-white/10"
          >
            <div className="indicator">
              <HiBell className="w-6 h-6 text-warning" />
              <span className="badge badge-xs indicator-item">
                {notifications.length}
              </span>
            </div>
          </div>
        </div>

        {/* ⚙️ Settings */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle hover:bg-white/10"
          >
            <HiCog className="w-7 h-7 text-white hover:text-gray-200 transition" />
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-1 shadow menu menu-xs dropdown-content bg-base-100 rounded-box w-48 top-8 border-gray-100"
          >
            <h3 className="font-semibold text-gray-700 px-2 mb-2">Settings</h3>
            <li>
              <a className="text-sm text-gray-700 hover:bg-gray-100 rounded-md transition px-2 py-1">
                Profile Settings
              </a>
            </li>
            <li>
              <a className="text-sm text-gray-700 hover:bg-gray-100 rounded-md transition px-2 py-1">
                Theme
              </a>
            </li>
            <li>
              <a className="text-sm text-gray-700 hover:bg-gray-100 rounded-md transition px-2 py-1">
                System Preferences
              </a>
            </li>
          </ul>
        </div>

        {/* User Profile */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="flex items-center cursor-pointer hover:bg-white/10 px-2 py-1 rounded-lg transition"
          >
            <div className="avatar placeholder">
              <div className="bg-primary-focus text-base-100 rounded-full w-8 h-8 flex items-center justify-center overflow-hidden border border-white shadow-md">
                {/* Dummy Avatar */}
                <img
                  src="/assets/images/default-avatar.png"
                  alt="User Avatar"
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?background=random&name=" +
                      (username || "U")
                  }}
                />
              </div>
            </div>

            {/* ✅ Display username */}
            <div className="ml-2 text-white text-sm font-medium">
              {firstName || "User"}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-white rounded-xl w-56 top-8"
          >
            <h3 className="text-gray-700 font-semibold mb-2 px-2">Account</h3>
            {userNavigateRender()}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default Navbar