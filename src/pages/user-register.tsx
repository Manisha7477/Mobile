import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

const UserRegister = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      await axios.post("https://122.166.153.170:8078/api/User/user-register", { email })
      setMessage("A reset link has been sent to your email. Please check your inbox.")
      setTimeout(() => router.push("/signin"), 2500)
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error sending reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md transform transition-all hover:scale-[1.01] space-y-1">
        {/* Logo */}
        <div className="flex justify-center items-center mb-2">
          <img
            src="/assets/images/companylogo.png"
            className="h-12 sm:h-12 cursor-pointer"
            alt="EMS Logo"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800 -mb-10">
          New User Register
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`p-2 rounded-lg text-center text-xs ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
            //   required
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            //   required
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              placeholder="Enter contact number"
            //   required
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
            //   required
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
            //   required
              className="w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-1.5 rounded-lg shadow-sm transition"
          >
            {loading ? "Sending..." : "Register"}
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

export default UserRegister
