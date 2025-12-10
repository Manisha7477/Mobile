import React from "react";
import {
  LayoutGrid,
  CheckCircle,
  FileText,
  CalendarDays,
  BarChart2,
} from "lucide-react";
interface LeaveTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  roleName?: string;
}

const allTabs = [
  { id: "Dashboard", name: "Dashboard", icon: LayoutGrid },
  { id: "Requests", name: "Requests", icon: CheckCircle },
  { id: "Ledger", name: "Ledger", icon: FileText },
  { id: "PublicHolidays", name: "Holidays", icon: CalendarDays },
  { id: "Leave Allocation", name: "Leave Allocation", icon: BarChart2 },
];

const LeaveTabs: React.FC<LeaveTabsProps> = ({ activeTab, onTabChange, roleName }) => {
  const filteredTabs = (() => {
    if (roleName === "Supervisor") {
      return allTabs.filter(t =>
        ["Dashboard", "Requests", "Ledger"].includes(t.id)
      );
    }
    if (roleName === "HR") {
      return allTabs; // show everything
    }
    return allTabs.filter(t => t.id === "Dashboard"); // others
  })();
  
  if (filteredTabs.length === 1) {
  return null; // hide tab bar entirely
}

  return (
    <div className="flex gap-1 sm:gap-2 mt-2 rounded-md w-full">
      {filteredTabs.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center justify-center gap-0.5 sm:gap-1 px-1 sm:px-2 lg:px-3 py-1.5 sm:py-2 rounded-md border transition-all duration-200 flex-1 min-w-0
            shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.4)]
            text-xs sm:text-sm md:text-base
            ${activeTab === id ? "bg-gray-200 text-blue-600" : "bg-white text-gray-700 hover:bg-blue-50"}
          `}
        >
          <Icon
            size={15}
            className={`flex-shrink-0 hidden sm:block ${
              activeTab === id ? "text-blue-600" : "text-gray-600"
            }`}
          />
          <span className="font-medium truncate">{name}</span>
        </button>
      ))}
    </div>
  );
};

export default LeaveTabs;
