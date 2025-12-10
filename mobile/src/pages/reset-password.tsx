import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import api from "../api/axiosInstance";
const ResetPassword = () => {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // Wait for Next.js router to be ready
  useEffect(() => {
    if (!router.isReady) return
    const t = router.query.token
    if (typeof t === "string") {
      setToken(t)
    } else {
      setMessage("Invalid or missing reset token.")
    }
  }, [router.isReady, router.query.token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!token) {
      setMessage("Invalid or missing reset token.")
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const res = await api.post("/api/password-reset/submit",
        {
          token,
          newPassword,
          confirmPassword,
        },
      )
      setMessage(res.data.message || "Password reset successful.")
      setTimeout(() => router.push("/signin"), 2500)
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error resetting password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md transform transition-all hover:scale-[1.02] space-y-6">
        {/* Logos */}
        <div className="flex justify-center items-center gap-4">
          <img
            src="/assets/images/companylogo.png"
            className="h-16 md:h-20 cursor-pointer"
            alt="ems"
          />
        </div>
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-sm text-gray-500">
            Enter your new password below to reset your account.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-center text-sm ${message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
              }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-2 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl shadow-md transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back */}
        <button
          type="button"
          aria-label="Back to Sign In"
          className="w-full text-blue-600 font-medium hover:underline text-sm"
          onClick={() => router.push("/signin")}
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  )
}

export default ResetPassword
