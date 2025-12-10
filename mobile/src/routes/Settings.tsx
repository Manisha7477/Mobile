import { useEffect, useState } from "react"
import ThemeToggle from "@/components/ThemeToggle"
import { getUserDetails } from "@/utils/AppConfig"
import { IUser } from "@/utils/types"
interface ISettingProps {
  user: IUser | null
}
const Settings: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light"
    }
    return "light"
  })

  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails("si@email.com") // adjust dynamically
        setUser(userDetails || null)
      } catch (error) {
        console.error("Failed to fetch user details:", error)
        setUser(null)
      }
    }

    fetchUserDetails()
  }, [])

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="text-2xl font-semibold mb-4">Settings</div>

      {/* Theme Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-2">Theme Setting</h2>
        <p className="text-gray-600 mb-4">
          Choose between light and dark mode for your website.
        </p>
        <ThemeToggle />
      </div>

      {/* Profile */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-medium mb-2">Profile</h2> */}
      {/* {user ? <Profile user={user} /> : <p>Loading...</p>} */}
      {/* <dd className="text-lg text-gray-900">
          {user?.firstName} {user?.lastName}
        </dd>
      </div> */}

      {/* Sample Table */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-medium mb-2">Sample Table</h2>
        <Table data={SAMPLE_TABLE_DATA} />
      </div> */}
    </div>
  )
}

export default Settings
