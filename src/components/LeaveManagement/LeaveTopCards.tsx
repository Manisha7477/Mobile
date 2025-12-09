import React, { useEffect, useState } from "react"
import { Briefcase, Calendar, Landmark, HeartPulse, Clock, Footprints } from "lucide-react"
import api from "@/api/axiosInstance"

function LeaveTopCards() {
  const [cards, setCards] = useState<any[]>([])

  useEffect(() => {
    const fetchLeaveSummary = async () => {
      try {
        const storedUser = localStorage.getItem("userData")
        const parsedUser = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUser?.userId

        const res = await api.get(`/api/leave/summary/${userId}`)

        const leaves = res.data?.leaves || []
        const summary = res.data?.summary || {}

        const find = (name: string) =>
          leaves.find((l: any) => l.leave_type_name === name)

        const mapped = [
          {
            title: "Casual Leave",
            allocated: find("Casual Leave")?.allocated || 0,
            balance: find("Casual Leave")?.balance || 0,
            Icon: Calendar,
          },
          {
            title: "Public Leave",
            allocated: find("Public Holidays")?.allocated || 0,
            balance: find("Public Holidays")?.balance || 0,
            Icon: Landmark,
          },
          {
            title: "Earned Leave",
            allocated: find("Earned Leave")?.allocated || 0,
            balance: find("Earned Leave")?.balance || 0,
            Icon: Briefcase,
          },
          {
            title: "Half Day Leave",
            allocated: find("Half Pay Leave")?.allocated || 0,
            balance: find("Half Pay Leave")?.balance || 0,
            Icon: HeartPulse,
          },
          {
            title: "Leave Taken",
            allocated: summary.total_taken || 0,
            balance: summary.total_taken || 0,
            Icon: Clock,
          },
          {
            title: "Pending Request",
            allocated: summary.total_pending || 0,
            balance: summary.total_pending || 0,
            Icon: Footprints,
          },
        ]

        setCards(mapped)
      } catch (error) {
        console.error(error)
      }
    }

    fetchLeaveSummary()
  }, [])
return (
  <div className="w-full px-1 sm:px-2 lg:px-1 rounded-md overflow-x-auto hide-scrollbar">
    <div className="flex gap-2 w-max">
      {cards.map((card, idx) => {
        const Icon = card.Icon
        return (
          <div
            key={idx}
            className="bg-white min-w-[180px] sm:min-w-[235px] rounded-md p-3 border border-gray-300 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-semibold text-gray-600">
                {card.title}
              </h6>
              <Icon className="h-5 w-5 text-gray-600" />
            </div>

            <div className="mt-1">
              <span className="text-xl font-bold text-gray-900">
                {card.balance}
              </span>
              <span className="text-gray-500 text-sm">
                {" "} / {card.allocated}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

}

export default LeaveTopCards
