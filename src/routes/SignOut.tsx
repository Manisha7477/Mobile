import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useUserStore } from "../store/user"
import useDependentStore from "@/store/dependents"
import api from "@/api/axiosInstance"
 
const SignOut: React.FC = () => {
  const router = useRouter()
  const { clearDependents } = useDependentStore()
  const logout = useUserStore((state) => state.logout)
  const setUserId = useUserStore((state) => state.setUserId)
  const [message, setMessage] = useState("")
 
  const executedRef = useRef(false); // 🔥 prevents double logout
 
  useEffect(() => {
    const manualLogout = async () => {
      if (executedRef.current) return;  // prevents second run
      executedRef.current = true;
 
      try {
        // Destroy tokens BEFORE API call
        nookies.destroy(null, "token", { path: "/" });
        nookies.destroy(null, "refreshToken", { path: "/" });
 
        // Manual logout ALWAYS calls this
        const res = await api.post("User/logout");
 
        const msg =
          typeof res.data === "string"
            ? res.data
            : res.data?.statusMessage || "Logout successful";
 
        setMessage(msg);
 
      } catch (err) {
        console.error("Manual logout error:", err);
      } finally {
        logout();
        setUserId(null);
        clearDependents();
 
        nookies.destroy(null, "userId", { path: "/" });
 
        router.replace("/signin");
      }
    };
 
    manualLogout();
  }, []);
 
  return (
    <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
      {message && <p>{message}</p>}
    </div>
  )
}
 
export default SignOut