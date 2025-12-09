import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useUserStore } from "../store/user"
import { IUser } from "@/utils/types"
import axios from "axios"

interface AuthContextType {
  user: IUser | null
  username: string | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  username: null,
  loading: true,
})

export function AuthProvider({ children }: any) {
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { user: storeUser, setUser: setUserStore } = useUserStore()

  useEffect(() => {
    const token = nookies.get(null).token
    if (!token) {
      router.push("/signin")
      return
    }

    if (storeUser) {
      setUser(storeUser)
      setLoading(false)
      return
    }

    const savedUser = localStorage.getItem("userData")
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      setUserStore(parsed)
      setLoading(false)
    } else {
      router.push("/signin")
    }
  }, [])

  console.log("✅ Logged in username:", user?.username)

  return (
    <AuthContext.Provider value={{ user, username: user?.username || null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
