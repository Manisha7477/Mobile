 
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import api from "@/api/axiosInstance";
 
export interface MocFilters {
  station: string;
  station_name: string;
  employment_type: string;
}
 
interface GPFilterDDProps {
  onStationSelect?: (station_name: string) => void;
  onEmploymentTypeSelect?: (employment_type: string) => void;
  onApplyFilter: (filters: MocFilters) => void;
  mocData: any[];
}
 
const HREmpFilter: React.FC<GPFilterDDProps> = ({
  onStationSelect,
  onApplyFilter,
  onEmploymentTypeSelect,
  mocData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wasApplied = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
 
  const [station_name, setStations] = useState<
    { station_id: number; station_name: string }[]
  >([]);
 
  const [filterState, setFilterState] = useState<MocFilters>({
    station: "",
    station_name: "",
    employment_type: "",
  });
  const isFiltered =
    filterState.station_name.trim() !== "" ||
    filterState.employment_type.trim() !== "";
  // Extract station + emp types
  const { dynamicStations, dynamicEmpTypes } = useMemo(() => {
    const safe = Array.isArray(mocData) ? mocData : [];
 
    const stations = Array.from(
      new Set(
        safe
          .map((r) => r?.station_name)
          .filter((v) => v && String(v).trim() !== "")
      )
    );
 
    const empTypes = Array.from(
      new Set(
        safe
          .map((r) => (r?.employment_type ?? r?.job_type ?? "").toString().trim())
          .filter((v) => v !== "")
      )
    );
 
    return { dynamicStations: stations, dynamicEmpTypes: empTypes };
  }, [mocData]);
 
  const handleFilterChange = (field: keyof MocFilters, value: string) => {
    setFilterState((prev) => ({ ...prev, [field]: value }));
  };
 
  const handleApplyFilter = () => {
    wasApplied.current = true;
 
    onApplyFilter({
      station: filterState.station.trim(),
      station_name: filterState.station_name.trim(),
      employment_type: filterState.employment_type.trim(),
    });
 
    setIsOpen(false);
  };
 
  const handleClearFilter = () => {
    const cleared = {
      station: "",
      station_name: "",
      employment_type: "",
    };
    setFilterState(cleared);
    onApplyFilter(cleared);
    setIsOpen(false);
  };
 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      <div className="relative">
        {isFiltered ? (
          <button
            onClick={handleClearFilter}
            className="flex items-center gap-2 border bg-blue-600 text-white border-blue-600 rounded-lg px-4 py-2 text-xs shadow-sm transition"
          >
            Clear Filters
          </button>
        ) : (
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-xs shadow-sm transition"
          >
            <Filter size={16} />
            Filters
          </button>
        )}
 
        {isOpen && (
          <div
            className="absolute top-full mt-1 bg-white shadow-xl border rounded-lg z-50 w-[420px] max-w-[95vw]"
            style={{ right: 0, left: "auto", transformOrigin: "top right" }}
          >
            <div className="px-4 py-1 border-b">
              <h2 className="text-blue-700 font-semibold text-base">
                Filter Options
              </h2>
            </div>
 
            <div className="px-4 py-2 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Station Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.station_name}
                  onChange={(e) =>
                    handleFilterChange("station_name", e.target.value)
                  }
                >
                  <option value="">Select Station</option>
                  {dynamicStations.map((name, idx) => (
                    <option key={idx} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
 
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
 
              {/* Employment Type Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.employment_type}
                  onChange={(e) =>
                    handleFilterChange("employment_type", e.target.value)
                  }
                >
                  <option value="">Employment Type</option>
                  {dynamicEmpTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
 
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
 
            <div className="flex justify-between gap-3 p-2 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={handleClearFilter}
                className="px-4 py-1 text-xs rounded-md border text-gray-700 hover:bg-gray-300"
              >
                Clear Filter
              </button>
 
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1 text-xs rounded-md border text-gray-700 hover:bg-gray-300"
                >
                  Close
                </button>
 
                <button
                  onClick={handleApplyFilter}
                  className="px-4 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default HREmpFilter;