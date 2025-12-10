import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Building,
  FileText,
  RefreshCw,
  AlertTriangle,
  ClipboardCheck,
  Key,
  User,
  UserCircle,
  List,
  Mail,
  Calendar,
  Book,
  CreditCard,
  File,
  Users,
  UserCog,
  Shield,
} from "lucide-react"
import api from "@/api/axiosInstance"

// Icon mapping object
const iconMap = {
  building: Building,
  "file-text": FileText,
  "refresh-cw": RefreshCw,
  "alert-triangle": AlertTriangle,
  "clipboard-check": ClipboardCheck,
  key: Key,
  user: User,
  "user-circle": UserCircle,
  list: List,
  mail: Mail,
  calendar: Calendar,
  book: Book,
  "credit-card": CreditCard,
  file: File,
  users: Users,
  "user-cog": UserCog,
  shield: Shield,
  menu: Menu,
}

// Types
interface ISubmenu {
  subMenuId: number
  subMenuName: string
  subMenuURL: string
  subMenuIcon: string
}

interface IMenu {
  menuId: number
  menuName: string
  menuURL: string
  menuIcon: string
  subMenuList: ISubmenu[]
}

interface IMergedSidebarProps {
  user: any
  username?: string | null
  userNavigation: any[]
  isOpenMenu: boolean
  handleMenuStatus: () => void
}

const MergedSidebar: React.FC<IMergedSidebarProps> = ({
  user,
  username,
  userNavigation,
  isOpenMenu,
  handleMenuStatus,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuData, setMenuData] = useState<IMenu[]>([])
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set())
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null)

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const storedUser = localStorage.getItem("userData")
        const parsedUser = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUser?.userId

        if (!userId) return

        const res = await api.get(`/api/Menu`, {
          params: { user_id: userId },
        })

        if (res.data?.status_code === "0000") {
          const normalizedMenus = res.data.data.map((menu: any) => ({
            menuId: menu.menu_id,
            menuName: menu.menu_name,
            menuURL: menu.menu_url,
            menuIcon: menu.menu_icon,
            subMenuList: (menu.submenu_list || []).map((sub: any) => ({
              subMenuId: sub.submenu_id,
              subMenuName: sub.submenu_name,
              subMenuURL: sub.submenu_url,
              subMenuIcon: sub.submenu_icon,
            })),
          }))
          setMenuData(normalizedMenus)
        } else {
          console.error("Menu API error:", res.data)
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error)
      }
    }

    fetchMenuData()
  }, [])

  const toggleMenu = (menuId: number) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(menuId)) newSet.delete(menuId)
      else newSet.add(menuId)
      return newSet
    })
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent ? <IconComponent size={23} /> : <Menu size={25} />
  }

  // Only show /hr-admin/personal-updates if role is HR
  const isSubmenuVisible = (url: string) => {
    if (url === "/hr-admin/personal-updates") return user?.roleName === "HR"
    return true
  }

  return (
    <aside
      className={`flex flex-col h-screen transition-all duration-300 bg-white shadow-lg border-r border-gray-200 ${
        isOpenMenu ? "w-64" : "w-12"
      }`}
    >
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-1 space-y-1">
        {menuData.map((menu) => (
          <div key={menu.menuId} className="mb-1">
            {/* Main Menu Item */}
            <button
              onClick={() => {
                if (menu.subMenuList.length > 0) toggleMenu(menu.menuId)
                else if (menu.menuURL) navigate(menu.menuURL)
              }}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all hover:bg-blue-50 ${
                expandedMenus.has(menu.menuId) ? "bg-blue-50" : ""
              }`}
              title={menu.menuName}
            >
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-blue-600 flex-shrink-0">
                  {getIcon(menu.menuIcon)}
                </span>
                {isOpenMenu && (
                  <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 truncate">
                    {menu.menuName}
                  </span>
                )}
              </div>
              {isOpenMenu && menu.subMenuList.length > 0 && (
                <span className="flex-shrink-0">
                  {expandedMenus.has(menu.menuId) ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )}
                </span>
              )}
            </button>

            {/* Submenu Items */}
            {isOpenMenu &&
              expandedMenus.has(menu.menuId) &&
              menu.subMenuList
                .filter((submenu) => isSubmenuVisible(submenu.subMenuURL))
                .map((submenu) => (
                  <button
                    key={submenu.subMenuId}
                    onClick={() => {
                      setActiveSubmenu(submenu.subMenuId)
                      if (submenu.subMenuURL) navigate(submenu.subMenuURL)
                    }}
                    title={submenu.subMenuName}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-gray-50 ${
                      activeSubmenu === submenu.subMenuId
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {getIcon(submenu.subMenuIcon)}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base truncate">
                      {submenu.subMenuName}
                    </span>
                  </button>
                ))}
          </div>
        ))}
      </nav>

      {/* User Section */}
      {isOpenMenu && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
              {username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {username || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || user?.userEmail || ""}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default MergedSidebar
