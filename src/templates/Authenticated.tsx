// Authenticated.tsx
import { BrowserRouter } from "react-router-dom"
import AppRouter from "@/routes/AppRouter"
import Navbar from "@/navigation/Navbar"
import { AppConfig, UserNavigation } from "@/utils/AppConfig"
import MergedSidebar from "@/navigation/MergedSidebar"
import { IUser,INavigationItem } from "@/utils/types"
import { useState } from "react"
import NewSideBarMenu from "@/navigation/NewSideBarMenu"

interface IAuthenticatedProps {
  user: IUser
  username: string | null
  meta: React.ReactNode
  children?: React.ReactNode   // ✅ Add this line
}

const NAVBAR_HEIGHT = 64

const Authenticated: React.FC<IAuthenticatedProps> = ({
  user,
  username,
  meta,
  children, // ✅ Include this
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClickMenu = () => setIsOpen(!isOpen)

  return (
    <BrowserRouter>
      {meta}
      <div className="flex flex-col min-h-screen w-full text-base-content">
        {/* Navbar */}
        <div
          className="fixed top-0 left-0 right-0 z-50"
          style={{ height: NAVBAR_HEIGHT }}
        >
          <Navbar
            user={user}
            username={username} // ✅ pass username to Navbar
            siteName={AppConfig.siteName}
            userNavigation={UserNavigation}
            handleMenuStatus={handleClickMenu}
            isOpenMenu={isOpen}
          />
        </div>

        {/* Main layout */}
        <div className="flex w-full" style={{ paddingTop: NAVBAR_HEIGHT }}>
          {/* Sidebar */}
          <div
            className={`bg-base-100 z-40 fixed sm:border-r-1 h-[calc(100vh-${NAVBAR_HEIGHT}px)] transition-all duration-300`}
          >
            <MergedSidebar
              user={user}
              username={username} // ✅ pass username if used inside
              userNavigation={UserNavigation}
              isOpenMenu={isOpen}
              handleMenuStatus={handleClickMenu}
            />
          </div>

          {/* Routes / Content */}
          <main
            className={`flex-1 min-h-screen overflow-x-auto scrollbar-hide transition-all duration-300 ${
              isOpen ? "ml-52" : "ml-14"
            } p-1`}
          >
            <AppRouter isOpenMenu={isOpen} />
            {children} {/* ✅ render children */}
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default Authenticated
