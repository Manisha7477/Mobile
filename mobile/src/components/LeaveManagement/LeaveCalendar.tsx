// src/components/leave/LeaveCalendar.tsx
import React from "react";
import { Calendar } from "lucide-react";

const LeaveCalendar: React.FC = () => {
    return (
        <div className="w-80 border bg-white rounded-md shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between -mt-3">
                <h3 className="text-lg font-semibold text-gray-700">Leave Calendar</h3>
                <Calendar className="text-gray-500" size={18} />
            </div>
            <div className="text-sm text-gray-500 mb-1">November 2025</div>
            <div className="grid grid-cols-7 gap-0 text-center text-gray-700">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="font-semibold">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                    <div
                        key={i}
                        className={`rounded-md py-1 ${i + 1 === 12
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 cursor-pointer"
                            }`}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>

            <h4 className="text-sm font-semibold">Leave Types</h4>
            <div className="mt-1 flex flex-row">
                <ul className="mr-20 text-sm">
                    <li><span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Casual</li>
                    <li><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Public</li>
                </ul>
                <ul className="text-sm">
                    <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Sick</li>
                    <li><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Other</li>
                </ul>
            </div>
        </div>
    );
};

export default LeaveCalendar;
