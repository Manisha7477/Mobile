import React, { useEffect, useState } from "react"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import api from "@/api/axiosInstance"

function TravelTopCards() {
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
    { name: "Pending Claims", value: cardData.total_requests, icon: FileText, iconColor: "text-blue-500" },
    { name: "Approved Claims", value: cardData.pending_review, icon: Clock, iconColor: "text-orange-500" },
    { name: "Changes Request", value: cardData.rejected, icon: AlertCircle, iconColor: "text-orange-500" },
    { name: "Total Ammount", value: cardData.approved, icon: CheckCircle, iconColor: "text-green-500" },
  ]

  return (
    <div className="w-full px-1 sm:px-2 lg:px-4 rounded-md overflow-x-auto hide-scrollbar">
      <div className="flex gap-1 -mr-3 -ml-4 sm:gap-3 lg:gap-2 rounded-md min-w-min">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white rounded-md border border-gray-200
                      p-1.5 sm:p-2
                      hover:shadow-md transition-all duration-200
                      flex-shrink-0 w-28 sm:w-40 lg:w-auto lg:flex-1"
            >
              <div className="flex items-center justify-between mb-0.5">
                <h6 className="text-[10px] sm:text-sm font-medium text-gray-600 truncate">
                  {card.name}
                </h6>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>

              <span className="text-lg sm:text-xl font-bold text-gray-800 leading-none">
                {card.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TravelTopCards