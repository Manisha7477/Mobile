import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import api from "../api/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await api.post("/api/password-reset/request",
        {
          email,
        },
      )
      setMessage(
        "A reset link has been sent to your email address. Please check your inbox.",
      )
      // Redirect to /signin after 2.5 seconds
      setTimeout(() => {
        router.push("/signin")
      }, 2500)
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error sending reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md transform transition-all hover:scale-[1.02] space-y-6">
        {/* Logos */}
        {/* <div className="w-[30vw] pl-16 flex justify-center items-center mb-3 ml-16"> */}
        <div className="flex justify-center  items-center gap-4  ml-46">
          {/* <img
            src="/assets/images/HSA-Logo.svg"
            className="h-12 sm:h-14 cursor-pointer"
            alt="HSA Logo"
          /> */}
          {/* <div className="border-l-4 h-10 sm:h-12 border-[#FFCB05]"></div> */}
          <img
            src="/assets/images/companylogo.png"
            className="h-12 sm:h-14 cursor-pointer"
            alt="EMS Logo"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Forgot Your Password?
          </h2>
          <p className="text-sm text-gray-500">
            Enter your registered email address and we’ll send you a reset link.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-center text-sm ${
              message.toLowerCase().includes("error")
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
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-xl shadow-md transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword
