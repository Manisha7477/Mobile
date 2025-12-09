import React, { useEffect, useState } from "react"
import { FileText, Clock, Eye, RotateCcw, ArrowRight, ClipboardList, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axiosInstance"

function GatePassCards() {
  const navigate = useNavigate()
  const [cardData, setCardData] = useState({
    total_gate_pass_today: 0,
    pending_approvals: 0,
    returnable_pending: 0,
    total_inward_passes: 0,
    total_entries: 0,
    total_outward_passes: 0,
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
        const res = await api.get(`/api/GatePass/other/CardData`, {
          params: { user_id: userId },
        })
        if (res.data) {
          setCardData(res.data)
          console.log("✅ MOC Data:", res.data)
        } else {
          console.error("⚠️ Invalid response:", res.data)
        }
      } catch (error) {
        console.error("🚨 Failed to fetch MOC counts:", error)
      }
    }
    fetchMocCounts()
  }, [])

  const cards = [
    { name: "Total Gate Passes Today", value: cardData.total_gate_pass_today, icon: FileText, iconColor: "text-blue-500", subtitle: "All types combined" },
    { name: "Pending Approval", value: cardData.pending_approvals, icon: Clock, iconColor: "text-orange-500", hasReview: true, isPendingCard: true, subtitle: "Awaiting review" },
    { name: "Returnable Pending", value: cardData.returnable_pending, icon: RotateCcw, iconColor: "text-green-500", subtitle: "All types combined" },
    { name: "Total Inward Passes", value: cardData.total_inward_passes, icon: ArrowRight, iconColor: "text-red-500", subtitle: "All Time" },
    { name: "Total Entries", value: cardData.total_entries, icon: ClipboardList, iconColor: "text-green-500", subtitle: "All time" },
    { name: "Total Outward Passes", value: cardData.total_outward_passes, icon: ArrowLeft, iconColor: "text-red-500", subtitle: "All time" },
  ]

  return (
    <div className="w-full sm:px-1 lg:px-1 rounded-md">
      <div className="flex gap-2 sm:gap-3 lg:gap-2 overflow-x-auto hide-scrollbar">
        {cards.map((card, index) => {
          const Icon = card.icon
          const bgColor =
            card.isPendingCard && card.value > 0 ? "bg-yellow-100" : "bg-white"

          return (
            <div
              key={index}
              className={`${bgColor} 
    min-w-[140px]   /* smaller on very small screens */
    sm:min-w-[165px] 
    md:min-w-[200px] 
    lg:min-w-[235px] 
    rounded-md duration-200 p-1
    border border-gray-300 transition-colors`}
            >
              <div className="flex items-center justify-between gap-2 ml-2">
                <h6 className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 truncate">
                  {card.name}
                </h6>
                <Icon className={`mr-3 h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`} />
              </div>
              <div className="flex items-center justify-between pl-2">
                <div className="-mt-2">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    {card.value}
                  </span>
                  <span className="text-xs text-gray-500 block">{card.subtitle}</span>
                </div>
                {card.hasReview && (
                  <button
                    onClick={() =>
                      navigate("/station-operations/gate-pass/AllGatePassList")
                    }
                    className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 mr-2 mb-2 py-1 rounded-md text-xs font-medium mt-6"
                  >
                    <Eye className="h-3 w-3" />
                    Review
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GatePassCards



