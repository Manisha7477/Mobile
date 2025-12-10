import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Filter } from "lucide-react";
import api from "@/api/axiosInstance";

export interface MocFilters {
  station: any;
  employee_code: string;
  status: string;
}

interface GPFilterDDProps {
  onApplyFilter: (filters: MocFilters) => void;
  mocData: any[];
}

const AssetFilter: React.FC<GPFilterDDProps> = ({
  onApplyFilter,
  mocData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [filterState, setFilterState] = useState<MocFilters>({
    station: undefined,
    employee_code: "",
    status: "",
  });

    // 👉 NEW: Detect whether filters are active
  const isFiltered =
    filterState.employee_code.trim() !== "" ||
    filterState.status.trim() !== "";
    
  // ----------------------------------------------------
  // Extract unique employee_code + statuses dynamically
  // ----------------------------------------------------
  const { employeeCodes, statuses } = useMemo(() => {
    const safe = Array.isArray(mocData) ? mocData : [];

    const empCodes = Array.from(
      new Set(
        safe
          .map((r) => r?.employee_code) // <-- FIXED: EMPLOYEE CODE ONLY
          .filter(
            (v) =>
              v !== undefined &&
              v !== null &&
              String(v).trim() !== ""
          )
      )
    );

    const statusList = Array.from(
      new Set(
        safe
          .map((r) => r?.status)
          .filter(
            (v) =>
              v !== undefined &&
              v !== null &&
              String(v).trim() !== ""
          )
      )
    );

    return {
      employeeCodes: empCodes,
      statuses: statusList,
    };
  }, [mocData]);

  const handleFilterChange = (field: keyof MocFilters, value: string) => {
    setFilterState((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    onApplyFilter({
      employee_code: filterState.employee_code.trim(),
      status: filterState.status.trim(),
      station: undefined
    });
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    const cleared: MocFilters = {
      employee_code: "",
      status: "",
      station: undefined
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      <div className="relative">

        {/* ------------------------------------
          👉 MAIN BUTTON (NOW TOGGLES)
        -------------------------------------*/}
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
            style={{
              right: 0,
              left: "auto",
              transformOrigin: "top right",
            }}
          >
            <div className="px-4 py-1 border-b">
              <h2 className="text-blue-700 font-semibold text-base">
                Filter Options
              </h2>
            </div>

            <div className="px-4 py-2 space-y-3 max-h-[70vh] overflow-y-auto">

              {/* Employee Code Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.employee_code}
                  onChange={(e) =>
                    handleFilterChange("employee_code", e.target.value)
                  }
                >
                  <option value="">Select Employee ID</option>

                  {employeeCodes.map((code, idx) => (
                    <option key={idx} value={code}>
                      {code}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Select Status</option>

                  {statuses.map((st, idx) => (
                    <option key={idx} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Footer */}
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

export default AssetFilter;


