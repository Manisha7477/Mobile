import React, { useState } from "react";
 
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 
interface MiniCalendarProps {
    highlightDates?: {
        date: string;  // "2025-12-03"
        type: string;  // "Casual Leave"
    }[];
}
 
const MiniCalendar: React.FC<MiniCalendarProps> = ({ highlightDates = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
 
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
 
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
 
    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };
 
    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };
 
    /** 🎨 Leave Color Map */
    const leaveColors: any = {
        "Casual Leave": "bg-blue-300 text-white",
        "Public Leave": "bg-green-300 text-white",
        "Public Holiday": "bg-green-300 text-white",
        "Earned Leave": "bg-yellow-300 text-black",
        "Half Pay Leave": "bg-red-300 text-white",
        "Half Day Leave": "bg-red-300 text-white",
        "Extra Ordinary Leave": "bg-sky-300 text-black",
        "Paternity Leave": "bg-purple-300 text-white",
    };
 
    /** 📌 Find color for a given date */
    const getDateHighlightClass = (date: string) => {
        const found = highlightDates.find((d) => d.date === date);
        if (found && leaveColors[found.type]) {
            return leaveColors[found.type];
        }
        return "";
    };
 
    return (
        <div className="p-4 rounded-md border shadow-sm bg-white w-full">
            {/* Header */}
            <div className="text-xl font-bold">Leave Calender</div>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-semibold">
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </h2>
 
                <div className="flex items-center gap-1">
                    <button
                        className="px-2 border rounded bg-gray-200"
                        onClick={prevMonth}
                    >
                        ‹
                    </button>
                    <button
                        className="px-2 border rounded bg-gray-200"
                        onClick={nextMonth}
                    >
                        ›
                    </button>
                </div>
            </div>
 
            {/* Days Row */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                {days.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>
 
            {/* Dates Grid */}
            <div className="grid grid-cols-7 text-center text-sm gap-x-2 gap-y-2">
                {Array.from({ length: firstDay }).map((_, idx) => (
                    <div key={`blank-${idx}`} />
                ))}
 
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const date = day + 1;
 
                    // Format YYYY-MM-DD
                    const dateISO = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                        date
                    ).padStart(2, "0")}`;
 
                    const highlightClass = getDateHighlightClass(dateISO);
 
                    const isToday =
                        new Date().toDateString() ===
                        new Date(year, month, date).toDateString();
 
                    const isSelected =
                        selectedDate.toDateString() ===
                        new Date(year, month, date).toDateString();
 
                    return (
                        <div
                            key={date}
                            onClick={() => setSelectedDate(new Date(year, month, date))}
                            className="relative flex justify-center items-center p-1 cursor-pointer"
                        >
                            {/* Smooth rounded background behind the date */}
                            {highlightClass && (
                                <div
                                    className={`absolute inset-0 mx-1 rounded-md opacity-90 ${highlightClass}`}
                                    style={{ zIndex: 0 }}
                                ></div>
                            )}
 
                            {/* Date Number */}
                            <span
                                className="relative z-10 font-semibold"
                                style={{
                                    color: highlightClass ? "white" : "black",
                                }}
                            >
                                {date}
                            </span>
                            {/* Selected outline */}
                            {isSelected && (
                                <div className="absolute inset-0 rounded-md ring-2 ring-blue-500 pointer-events-none"></div>
                            )}
                        </div>
 
                    );
                })}
            </div>
 
            {/* LEGEND / COLORS */}
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Casual Leave</span>
                </div>
 
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>Public Holiday</span>
                </div>
 
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>Earned Leave</span>
                </div>
 
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>Half Pay Leave</span>
                </div>
 
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                    <span>Extraordinary Leave</span>
                </div>
            </div>
        </div>
    );
};
 
export default MiniCalendar;