import React, { useEffect, useState } from "react"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import api from "@/api/axiosInstance"

function MocTopCards() {
  const [cardData, setCardData] = useState({
    total_requests: 0,
    pending_review: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    const fetchMocCounts = async () => {
      try {
        const storedUser = localStorage.getItem("userData")
        const parsedUser = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUser?.userId

        if (!userId) {
          console.error("❌ userId not found in localStorage")
          return
        }

        const res = await api.get(`/api/MOC/TotalCount`, {
          params: { user_id: userId },
        })

        if (res.data?.data) {
          setCardData(res.data.data)
          console.log("✅ MOC Data:", res.data.data)
        } else {
          console.error("⚠️ Invalid response:", res.data)
        }
      } catch (error) {
        console.error("🚨 Failed to fetch MOC counts:", error)
      }
    }

    fetchMocCounts()
  }, [])

  // ✅ Use dynamic values from API
  const cards = [
    { name: "Total Requests", value: cardData.total_requests, icon: FileText, iconColor: "text-blue-500" },
    { name: "Pending Review", value: cardData.pending_review, icon: Clock, iconColor: "text-orange-500" },
    { name: "Approved", value: cardData.approved, icon: CheckCircle, iconColor: "text-green-500" },
    { name: "Rejected", value: cardData.rejected, icon: XCircle, iconColor: "text-red-500" },
  ]

  return (
   <div className="w-full px-1 sm:px-2 lg:px-1 rounded-md overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 sm:gap-3 lg:gap-2 rounded-md min-w-min">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white rounded-md duration-200 p-3 sm:p-4 border border-gray-300 hover:shadow-md transition-shadow flex-shrink-0 w-40 sm:w-48 lg:w-auto lg:flex-1"
            >
              <div className="flex items-center justify-between gap-2">
                <h6 className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 truncate">{card.name}</h6>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${card.iconColor}`} />
              </div>
              <div className="mt-2 sm:mt-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  {card.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MocTopCards