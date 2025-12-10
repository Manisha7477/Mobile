import React from "react";
import {
  LayoutGrid,
  CheckCircle,
} from "lucide-react";
interface TravelExpenseTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  roleName?: string;
}

const allTabs = [
  { id: "Dashboard", name: "Dashboard", icon: LayoutGrid },
  { id: "Requests", name: "Requests", icon: CheckCircle },
];

const TravelExpenseTabs: React.FC<TravelExpenseTabsProps> = ({ activeTab, onTabChange, roleName }) => {
  const filteredTabs = (() => {
    if (roleName === "Supervisor") {
      return allTabs;
    }
    if (roleName === "HR") {
      return allTabs;
    }
    if (roleName === "MD") {
      return allTabs;
    }
    if (roleName === "Finance") {
      return allTabs;
    }
    return allTabs.filter(t => t.id === "Dashboard");
  })();

  if (filteredTabs.length === 1) {
    return null; // hide tab bar entirely
  }

  return (
    <div className="flex gap-1 sm:gap-2 mt-1 rounded-md w-full">
      {filteredTabs.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-md border
    transition-all duration-200 flex-1 min-w-0 shadow-sm hover:shadow-md      
    text-xs sm:text-sm
    ${activeTab === id
              ? "bg-blue-100 text-blue-700 border-blue-300"
              : "bg-white text-gray-600 hover:bg-gray-100"
            }
  `}
        >
          <Icon
            size={14}
            className={`hidden sm:block ${activeTab === id ? "text-blue-700" : "text-gray-500"
              }`}
          />
          <span className="font-medium truncate">{name}</span>
        </button>

      ))}
    </div>
  );
};

export default TravelExpenseTabs;