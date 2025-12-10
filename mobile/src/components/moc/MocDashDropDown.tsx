import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar, MapPin } from "lucide-react";
import api from "@/api/axiosInstance";

export interface MocFilters {
  created_by: string;
  moc_request_no: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface MocDropdownProps {
  onStationSelect?: (stationName: string) => void;
  onTimeSelect?: (days: number | null) => void;
  mocData: any[];
}

const MocDashDropDown: React.FC<MocDropdownProps> = ({
  onStationSelect,
  onTimeSelect,
  mocData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<{ station_id: number; station_name: string }[]>([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");
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
    </div>
  );
};

export default MocDashDropDown;