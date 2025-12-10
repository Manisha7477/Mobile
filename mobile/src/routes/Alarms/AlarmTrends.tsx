import React, { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-GB", { hour12: false })

const generateTrendPoint = () => ({
  time: formatTime(new Date()),
  Critical: getRandom(3, 12),
  High: getRandom(2, 10),
  Medium: getRandom(1, 8),
  Low: getRandom(0, 5),
})

const generateTopSources = () => [
  { equipment: "Generator-01", alarms: getRandom(10, 25) },
  { equipment: "Chiller-02", alarms: getRandom(8, 20) },
  { equipment: "Boiler-01", alarms: getRandom(5, 15) },
  { equipment: "Compressor-03", alarms: getRandom(3, 12) },
]

const AlarmTrends: React.FC = () => {
  const [alarmTrendData, setAlarmTrendData] = useState(
    Array.from({ length: 6 }, () => generateTrendPoint()),
  )
  const [topSourcesData, setTopSourcesData] = useState(generateTopSources())

  const latest = alarmTrendData[alarmTrendData.length - 1]

  useEffect(() => {
    const interval = setInterval(() => {
      setAlarmTrendData((prev) => [...prev.slice(1), generateTrendPoint()])
      setTopSourcesData(generateTopSources())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🚨 Alarm Trends Dashboard</h1>

      {/* Vertical KPIs + Severity Trend side by side */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* KPIs Vertical */}
        <div className="flex flex-col gap-4 w-full md:w-1/4">
          <div className="bg-red-600 text-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Critical</h2>
            <p className="text-3xl font-bold">{latest?.Critical ?? 0}</p>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">High</h2>
            <p className="text-3xl font-bold">{latest?.High ?? 0}</p>
          </div>
          <div className="bg-yellow-400 text-black p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Medium</h2>
            <p className="text-3xl font-bold">{latest?.Medium ?? 0}</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Low</h2>
            <p className="text-3xl font-bold">{latest?.Low ?? 0}</p>
          </div>
        </div>

        {/* Severity Trend Chart */}
        <div className="bg-white shadow rounded-xl p-4 w-full md:w-3/4">
          <h2 className="text-lg font-semibold mb-2">Severity Trend (Live)</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={alarmTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Critical"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="High"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Medium"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Low"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top alarm sources */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">Top Alarm Sources</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topSourcesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="equipment" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="alarms" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AlarmTrends
