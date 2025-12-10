import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { classNames } from "@/utils/dom"
import { Link, useLocation } from "react-router-dom"
import { HiOutlineTable } from "react-icons/hi"
import api from "@/api/axiosInstance"
import { useAuth } from "@/contexts/auth"
import { FaChevronDown, FaChevronUp } from "react-icons/fa6"
// ✅ Import icon sets
import * as MdIcons from "react-icons/md";
import * as LucideIcons from "lucide-react";
import * as HiIcons from "react-icons/hi";
import * as FaIcons from "react-icons/fa";
import { FileQuestion } from "lucide-react";

// ✅ Merge all supported icon libraries
const iconSets = {
    ...HiIcons,
    ...FaIcons,
    ...MdIcons,
    ...LucideIcons,
};

export const getIconComponent = (iconName: string | number): React.ElementType => {
    if (!iconName) return FileQuestion;

    const cleanName = String(iconName).trim();

    const pascalName = cleanName
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

    const possibleKeys = [
        pascalName, 
        cleanName,
        `Fa${pascalName}`, 
        `Hi${pascalName}`, 
        `Md${pascalName}`,
        `Lucide${pascalName}`,
    ];

    for (const key of possibleKeys) {
        const Icon = iconSets[key as keyof typeof iconSets];
        if (Icon && (typeof Icon === "function" || typeof Icon === "object")) {
            return Icon as React.ElementType;
        }
    }

    console.warn(`⚠️ Icon not found for name: ${iconName}`);
    return FileQuestion;
};
interface ISubMenu {
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
    subMenuList?: ISubMenu[]
}
interface SideBarMenuProps {
    isOpenMenu: boolean
}

const NewSideBarMenu: React.FC<SideBarMenuProps> = ({ isOpenMenu }) => {
    const { pathname } = useLocation()
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [menuData, setMenuData] = useState<IMenu[]>([])
    const [tooltipState, setTooltipState] = useState({
        show: false,
        text: "",
        position: { x: 0, y: 0 },
    })

   useEffect(() => {
  const fetchMenuData = async () => {
    try {
      // 👇 Read from localStorage
      const storedUser = localStorage.getItem("userData")
      const parsedUser = storedUser ? JSON.parse(storedUser) : null
      const userId = parsedUser?.userId

      if (!userId) {
        console.error("❌ userId not found in localStorage")
        return
      }
      
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
        console.log("✅ Normalized Menu Data:", normalizedMenus)
      } else {
        console.error("⚠️ Menu API error:", res.data)
      }
    } catch (error) {
      console.error("🚨 Failed to fetch menu:", error)
    }
  }

  fetchMenuData()
}, [])


    const toggleMenu = (menuName: string) => {
        setActiveMenu((prev) => (prev === menuName ? null : menuName))
    }

    const getTooltipRoot = () => {
        let tooltipRoot = document.getElementById("tooltip-root")
        if (!tooltipRoot) {
            tooltipRoot = document.createElement("div")
            tooltipRoot.id = "tooltip-root"
            tooltipRoot.style.position = "absolute"
            tooltipRoot.style.top = "0"
            tooltipRoot.style.left = "0"
            tooltipRoot.style.pointerEvents = "none"
            tooltipRoot.style.zIndex = "2147483647"
            document.body.appendChild(tooltipRoot)
        }
        return tooltipRoot
    }

    const showTooltip = (text: string, event: React.MouseEvent) => {
        if (!isOpenMenu) {
            const rect = event.currentTarget.getBoundingClientRect()
            setTooltipState({
                show: true,
                text,
                position: {
                    x: rect.right + 12,
                    y: rect.top + rect.height / 2 - 15,
                },
            })
        }
    }

    const hideTooltip = () => {
        setTooltipState((prev) => ({ ...prev, show: false }))
    }

    const PortalTooltip: React.FC = () => {
        if (!tooltipState.show || isOpenMenu) return null
        return createPortal(
            <div
                className="fixed pointer-events-none z-[2147483647] transition-all duration-300 ease-in-out"
                style={{
                    left: `${tooltipState.position.x}px`,
                    top: `${tooltipState.position.y}px`,
                }}
            >
                <div className="relative">
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    <div className="bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700">
                        {tooltipState.text}
                    </div>
                </div>
            </div>,
            getTooltipRoot()
        )
    }

    const renderSubMenu = (subMenus: ISubMenu[], isExpanded: boolean) => {
        return (
            subMenus &&
            subMenus.map((subItem, index) => {
                const SubMenuIcon = getIconComponent(subItem.subMenuIcon)
                return (
                    <div
                        key={subItem.subMenuId}
                        className={classNames(
                            "transition-all duration-200",
                            isExpanded ? "block" : "flex justify-center"
                        )}
                        style={!isExpanded ? { animationDelay: `${index * 50}ms` } : {}}
                    >
                        <Link
                            to={subItem.subMenuURL}
                            className={classNames(
                                "flex items-center transition-all duration-200 hover:bg-base-200 rounded-md hover:shadow-sm",
                                isExpanded
                                    ? "gap-1 px-2 py-1 text-sm hover:pl-3"
                                    : "p-1 justify-center w-9 h-9 hover:w-10 hover:h-10",
                                pathname.includes(subItem.subMenuURL)
                                    ? "text-primary bg-primary/10 shadow-sm"
                                    : "hover:text-primary",
                                pathname.includes(subItem.subMenuURL) && isExpanded
                                    ? "border-l-2 border-primary/50 pl-2"
                                    : ""
                            )}
                            onMouseEnter={(e) => showTooltip(subItem.subMenuName, e)}
                            onMouseLeave={hideTooltip}
                        >
                            <div className="flex-shrink-0">
                                {SubMenuIcon ? (
                                    <SubMenuIcon className="w-4 h-4" />
                                ) : (
                                    <HiOutlineTable className="w-4 h-4" />
                                )}
                            </div>
                            {isExpanded && (
                                <span className="truncate text-[13px] ml-1">
                                    {subItem.subMenuName}
                                </span>
                            )}
                        </Link>
                    </div>
                )
            })
        )
    }

    const renderMenu = () => {
        return (
            menuData &&
            menuData.map((menuItem: IMenu) => {
                const MenuIcon = getIconComponent(menuItem.menuIcon)
                const isMenuActive = activeMenu === menuItem.menuName
                const hasSubMenus =
                    Array.isArray(menuItem.subMenuList) && menuItem.subMenuList.length > 0

                return (
                    <li className="mb-1" key={menuItem.menuId}>
                        {hasSubMenus ? (
                            <div>
                                <div
                                    className={classNames(
                                        "flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200 hover:bg-base-200 hover:shadow-sm",
                                        isMenuActive ? "bg-base-200 shadow-sm" : "",
                                        !isOpenMenu ? "justify-center" : "",
                                        "min-h-[44px]"
                                    )}
                                    onClick={() => toggleMenu(menuItem.menuName)}
                                    onMouseEnter={(e) =>
                                        showTooltip(menuItem.menuName, e)
                                    }
                                    onMouseLeave={hideTooltip}
                                >
                                    <div
                                        className={classNames(
                                            " flex-shrink-0 flex justify-center items-center w-6 h-6",
                                            "visible opacity-100 transition-opacity duration-200"
                                        )}
                                    >
                                        {MenuIcon ? (
                                            <MenuIcon className="w-10 h-15 text-gray-700" />
                                        ) : (
                                            <HiOutlineTable className="w-5 h-5 text-gray-700" />
                                        )}
                                    </div>
                                    <span
                                        className={classNames(
                                            "truncate transition-all duration-200",
                                            isOpenMenu ? "-ml-3 block" : "hidden",
                                            "text-[14px]"
                                        )}
                                    >
                                        {menuItem.menuName}
                                    </span>
                                    {isOpenMenu && (
                                        <span className="text-sm ml-auto">
                                            {isMenuActive ? (
                                                <FaChevronUp className="w-3 h-3" />
                                            ) : (
                                                <FaChevronDown className="w-3 h-3" />
                                            )}
                                        </span>
                                    )}
                                </div>
                                {isMenuActive && (
                                    <div
                                        className={classNames(
                                            "transition-all duration-300 ease-in-out",
                                            isOpenMenu
                                                ? "border-l-2 border-gray-200 pl-2 ml-2 mt-2 space-y-1"
                                                : "flex flex-col items-center mt-2 space-y-2"
                                        )}
                                    >
                                        {renderSubMenu(menuItem.subMenuList || [], isOpenMenu)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to={menuItem.menuURL}
                                className={classNames(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-base-200 hover:shadow-sm",
                                    pathname.includes(menuItem.menuURL)
                                        ? "text-primary bg-primary/10 shadow-sm border-l-2 border-primary"
                                        : "hover:text-primary",
                                    !isOpenMenu ? "justify-center" : "",
                                    "min-h-[44px]"
                                )}
                                onMouseEnter={(e) => showTooltip(menuItem.menuName, e)}
                                onMouseLeave={hideTooltip}
                            >
                                <div
                                    className={classNames(
                                        "flex-shrink-0 flex justify-center items-center w-6 h-6",
                                        "visible opacity-100 transition-opacity duration-200"
                                    )}
                                >
                                    {MenuIcon ? (
                                        <MenuIcon className="w-5 h-5 text-gray-700" />
                                    ) : (
                                        <HiOutlineTable className="w-5 h-5 text-gray-700" />
                                    )}
                                </div>

                                <span
                                    className={classNames(
                                        "truncate transition-all duration-200",
                                        isOpenMenu ? "ml-2 block" : "hidden"
                                    )}
                                >
                                    {menuItem.menuName}
                                </span>
                            </Link>
                        )}
                    </li>
                )
            })
        )
    }

    return (
        <>
            <PortalTooltip />
            <div
                className={classNames(
                    "drawer sm:drawer-open z-40",
                    isOpenMenu ? "drawer-open" : ""
                )}
            >
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="bg-base-100 h-auto w-auto overflow-hidden scrollbar-hidden">
                        <div
                            className={classNames(
                                "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-all duration-300",
                                isOpenMenu ? "w-full" : "w-full",
                                isOpenMenu ? "block" : "hidden sm:block"
                            )}
                        >
                            <nav className="h-full relative">
                                <ul className={classNames("space-y-1")}>{renderMenu()}</ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewSideBarMenu
