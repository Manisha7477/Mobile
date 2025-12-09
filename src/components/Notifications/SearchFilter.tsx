import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
 
interface ModuleItem {
  label: string;
  color: string;
}
 
const MODULES: ModuleItem[] = [
  { label: "Management Of Changes", color: "#E6194B" },
  { label: "Leave Management", color: "#3CB44B" },
  { label: "Gate Pass Management", color: "#013B5A" },
  { label: "Travel Management", color: "#F58231" },
  { label: "Claim Management", color: "#911EB4" },
  { label: "Digital LogBook", color: "#46F0F0" },
  { label: "HSE Incident Reporting", color: "#FFD700" },
  { label: "Permit Management", color: "#A2C702" },
  { label: "Employee Personal Updates", color: "#008080" },
  { label: "HR Action Tracker Employer", color: "#AA6E28" },
  { label: "Circular Management", color: "#800000" },
  { label: "Training Planner", color: "#808000" },
];
 
interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedModule: string;
  onModuleChange: (module: string) => void;
}
 
const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedModule,
  onModuleChange,
}) => {
  const [open, setOpen] = useState(false);
 
  return (
    <div className="w-full bg-white border-t border-b border-gray-200 p-2">
      <div className="flex justify-between items-center">
 
        {/* 🔍 Search Box */}
        <div className="relative w-80 ml-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search here..."
            className="w-full h-9 pl-10 pr-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
 
        {/* ▼ Choose Module Dropdown + Clear Filter */}
        <div className="flex items-center gap-3 mr-8">
 
          {/* Dropdown */}
          <div className="relative">
            <button
              className="flex items-center justify-between gap-2 px-4 h-9 w-52 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
              onClick={() => setOpen(!open)}
            >
              {selectedModule || "Choose Module"}
              <ChevronDown
                className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
              />
            </button>
 
            {open && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {MODULES.map((mod) => (
                  <div
                    key={mod.label}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onModuleChange(mod.label);
                      setOpen(false);
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: mod.color }}
                    />
                    <span className="text-sm">{mod.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
 
          {/* Clear Filter Button */}
          <button
            onClick={() => onModuleChange("")}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:bg-gray-50 text-gray-700"
          >
            Clear Filter
          </button>
        </div>
 
      </div>
    </div>
  );
};
 
export default SearchFilter;