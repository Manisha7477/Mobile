import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Filter, Calendar, MapPin } from "lucide-react";
import api from "@/api/axiosInstance";

export interface MocFilters {
  created_by: string;
  moc_request_no: string;
  status: string;
  startDate: string;
  endDate: string;
  hideFilters?: boolean;
}

interface MocDropdownProps {
  onStationSelect?: (stationName: string) => void;
  onTimeSelect?: (days: number | null) => void;
  onApplyFilter: (filters: MocFilters) => void;
  mocData: any[];
  hideFilters?: boolean;
}

const MocDropdown: React.FC<MocDropdownProps> = ({
  onStationSelect,
  onTimeSelect,
  onApplyFilter,
  mocData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wasApplied = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<{ station_id: number; station_name: string }[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [filterState, setFilterState] = useState<MocFilters>({
    created_by: "",
    moc_request_no: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const safeMocData = mocData || [];

  const requestors = useMemo(
    () => Array.from(new Set(safeMocData.map((r) => r?.created_by).filter(Boolean))),
    [mocData]
  );

  const mocRequestNo = useMemo(
    () => Array.from(new Set(safeMocData.map((r) => r?.moc_request_no).filter(Boolean))),
    [mocData]
  );

  const statuses = useMemo(
    () => Array.from(new Set(safeMocData.map((r) => r?.status).filter(Boolean))),
    [mocData]
  );

  const filteredRequestNos = useMemo(() => {
    const filtered = safeMocData.filter((r) =>
      filterState.created_by ? r?.created_by === filterState.created_by : true
    );
    return Array.from(new Set(filtered.map((r) => r?.moc_request_no).filter(Boolean)));
  }, [mocData, filterState.created_by]);

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStation(value);
    onStationSelect?.(value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTime(value);
    if (value === "All Time") onTimeSelect?.(null);
    else onTimeSelect?.(parseInt(value.replace(/\D/g, ""), 10));
  };

  const handleFilterChange = (field: keyof MocFilters, value: string) => {
    setFilterState((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "created_by" && prev.moc_request_no) {
        const stillMatches = (mocData || []).some(
          (item) => item?.moc_request_no === prev.moc_request_no && item?.requester === value
        );
        if (!stillMatches) next.moc_request_no = "";
      }
      return next;
    });
  };
  const handleRequestNoChange = (value: string) => {
    setFilterState(prev => ({ ...prev, moc_request_no: value }));
    const selected = mocData.find(item => item.moc_request_no === value);
    if (selected) {
      setFilterState(prev => ({
        ...prev,
        created_by: selected.created_by || "",
        status: selected.status || "",
      }));
    }
    if (!value) {
      setFilterState(prev => ({
        ...prev,
        created_by: "",
        status: "",
      }));
    }
  };

  const handleApplyFilter = () => {
    wasApplied.current = true;
    onApplyFilter(filterState);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    const clearedState: MocFilters = {
      created_by: "",
      moc_request_no: "",
      status: "",
      startDate: "",
      endDate: "",
    };
    setFilterState(clearedState);
    onApplyFilter(clearedState);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get(`/api/stationsDD`);
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setStations(data);
        } else {
          console.warn("⚠️ Unexpected Stations API response:", res.data);
        }
      } catch (err) {
        console.error("🚨 Error fetching stations:", err);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (!isOpen && !wasApplied.current) {
      setFilterState({
        created_by: "",
        moc_request_no: "",
        status: "",
        startDate: "",
        endDate: "",
      });
    }
    if (isOpen) wasApplied.current = false;
  }, [isOpen]);

  return (
    <div className="relative flex items-center gap-3" ref={ref}>
      <div className="relative flex items-center">
        <Calendar className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
        <select
          className="appearance-none border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedTime}
          onChange={handleTimeChange}
        >
          <option>All Time</option>
          <option>7 days</option>
          <option>15 days</option>
          <option>30 days</option>
          <option>60 days</option>
          <option>90 days</option>
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
      </div>
      <div className="relative flex items-center w-100">
        <MapPin className="w-4 h-4 text-gray-500 absolute left-1 pointer-events-none" />
        <select
          value={selectedStation}
          onChange={handleStationChange}
          className="appearance-none border border-gray-300 rounded-lg pl-5 pr-2 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Locations</option>
          {stations.map((station) => (
            <option key={station.station_id} value={station.station_name}>
              {station.station_name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 absolute pl-10 pointer-events-none" />
      </div>
      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-xs shadow-sm transition"
        >
          <Filter size={16} />
          Filters
        </button>
        {isOpen && (
          <div
            className="absolute top-full mt-1 bg-white shadow-xl border rounded-lg z-[9999] w-[420px] max-w-[95vw]"
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
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.created_by}
                  onChange={(e) => handleFilterChange("created_by", e.target.value)}
                >
                  <option value="" disabled hidden>Moc Requestor Name</option>
                  {requestors.map((name) => (<option key={name} value={name}>{name}</option>))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.moc_request_no}
                  onChange={(e) => handleRequestNoChange(e.target.value)}
                >
                  <option value="" disabled hidden>MOC Request No.</option>
                  {mocRequestNo.map((no) => (
                    <option key={no} value={no}>{no}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium -mt-1 mb-1 text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={filterState.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="w-full border rounded-md px-4 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium -mt-1 mb-1 text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={filterState.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="w-full border rounded-md px-4 py-1 text-xs"
                  />
                </div>
              </div>
              <div className="relative">
                <select
                  className="appearance-none w-full border border-blue-400 rounded-md px-4 py-1 text-xs text-gray-700 focus:ring-2 focus:ring-blue-400 pr-8"
                  value={filterState.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="" disabled hidden>Status</option>
                  {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
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

export default MocDropdown;