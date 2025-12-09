import React, { useEffect, useState } from "react"
interface Alarm {
  id: string
  equipment: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

const AlarmTrace: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">
   <h1>Next Page 2</h1>
    </div>
  )
}

export default AlarmTrace
