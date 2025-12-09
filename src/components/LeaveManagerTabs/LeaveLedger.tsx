import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface StationLeave {
    name: string;
    value: number;
    leaves: number;
    color: string;
}

const LeaveLedger: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState("Last 6 Months");
    const [monthlyData, setMonthlyData] = useState<{ month: string; leaves: number }[]>([]);
    const [stationData, setStationData] = useState<StationLeave[]>([]);

    const storedUser = localStorage.getItem("userData");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const role = parsedUser?.roleName;
    const userId = parsedUser?.userId;

    const COLORS = ["#5B5FFF", "#FFA500", "#A855F7", "#00D97E", "#00C9FF"];

    /* ----------------------------------------------------------------
       1️⃣ FETCH MONTHLY TRENDS FOR BOTH HR & SUPERVISOR
       ---------------------------------------------------------------- */
    useEffect(() => {
        const fetchMonthlyTrends = async () => {
            try {
                let url = "";

                if (role === "HR") {
                    url = "/api/leave/hr-station-leave-count";
                } else if (role === "Supervisor" || role === "supervisor") {
                    url = `/api/leave/supervisor-leave-count?supervisor_id=${userId}`;
                } else {
                    return;
                }

                const res = await api.get(url);
                const monthly = res.data.monthly_trends || [];

                let formatted: any[] = [];

                if (role === "HR") {
                    // HR → month + total_leaves already correct
                    formatted = monthly.map((item: any) => ({
                        month: item.month || "NA",
                        leaves: item.total_leaves ?? 0,
                    }));
                } else {
                    // Supervisor → group leaves by month
                    const monthMap: Record<string, number> = {};

                    monthly.forEach((item: any) => {
                        const m = item.month || "NA";
                        const leaves = item.total_leaves ?? 0;
                        monthMap[m] = (monthMap[m] || 0) + leaves;
                    });

                    formatted = Object.entries(monthMap).map(([month, leaves]) => ({
                        month,
                        leaves,
                    }));
                }

                setMonthlyData(formatted);
            } catch (err) {
                console.error("Monthly trend error:", err);
            }
        };

        fetchMonthlyTrends();
    }, [role, userId]);

    /* ----------------------------------------------------------------
       2️⃣ FETCH PIE GRAPH DATA (HR → station_summary, Supervisor → employee_summary)
       ---------------------------------------------------------------- */
    useEffect(() => {
        const fetchPieData = async () => {
            try {
                let url = "";

                if (role === "HR") {
                    url = "/api/leave/hr-station-leave-count";
                } else if (role === "Supervisor" || role === "supervisor") {
                    url = `/api/leave/supervisor-leave-count?supervisor_id=${userId}`;
                } else {
                    return;
                }

                const res = await api.get(url);

                let formatted: StationLeave[] = [];

                if (role === "HR") {
                    const stationSummary = res.data.station_summary || [];

                    formatted = stationSummary.map((item: any, index: number) => ({
                        name: item.station_name,
                        value: item.percentage_split,
                        leaves: item.total_leaves,
                        color: COLORS[index % COLORS.length],
                    }));
                } else {
                    const empSummary = res.data.employee_summary || [];

                    formatted = empSummary.map((item: any, index: number) => ({
                        name: `${item.first_name} ${item.last_name}`,
                        value: item.percentage_split,
                        leaves: item.total_leaves,
                        color: COLORS[index % COLORS.length],
                    }));
                }
                setStationData(formatted);
            } catch (err) {
                console.error("Pie graph error:", err);
            }
        };

        fetchPieData();
    }, [role, userId]);

    return (
        <div className="h-screen overflow-y-auto bg-white rounded-lg shadow-sm p-2">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">Leave Allocation</h2>

                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                    <option>Last Year</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MONTHLY CHART */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-1 text-gray-700">
                        Monthly Leave Trends
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="leaves" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE CHART */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-md font-semibold mb-1 text-gray-700">
                        {role === "HR" ? "Station wise Leave Usage" : "Team wise Leave Usage"}
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={stationData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                labelLine={false}
                                label={({ name, value }) => `${name} (${value}%)`}
                                dataKey="value"
                            >
                                {stationData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div className="mt-2 border-t pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {stationData.map((station, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: station.color }}
                                    ></div>

                                    <span className="text-xs text-gray-800">{station.name}</span>

                                    <span className="text-xs font-semibold text-gray-900">
                                        {station.leaves} Leaves
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveLedger;
