import React, { useEffect, useState } from "react";
import BasicTable from "@/components/tables/BasicTable";
import { MOC_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import MocTopHeader from "./MocTopHeader";
import api from "@/api/axiosInstance";
import MocDropdown from "./MocDropdown"; // Ensure this is imported
import { Search } from "lucide-react";

// Interface for advanced filters to ensure type safety
interface MocFilters {
  created_by?: string;
  moc_request_no?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
interface IMOCTableRow {
  slNo: number;
  moc_request_no: string;
  title: string;
  station_name: string;
  created_by: string;
  date: string;
  status: string;
  action: string;
  mocClosure?: string;
}

const MocViewAll = () => {
  const [tableData, setTableData] = useState<IMOCTableRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1000);

  // 💡 NEW STATE FOR ADVANCED FILTERS
  const [activeFilters, setActiveFilters] = useState<MocFilters>({
    created_by: "",
    moc_request_no: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // State to force the filter logic to re-run when 'Apply Filter' is clicked
  const [triggerFilter, setTriggerFilter] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMocData = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("userData");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = parsedUser?.userId;

        const res = await api.get(`/api/MOC/GetByUser/${userId}`);
        const records = res.data?.data?.data || [];

        if (Array.isArray(records)) {
          const formatted = records.map((item: any, idx: number) => ({
            slNo: idx + 1,
            moc_request_no: item.moc_request_no || "-",
            title: item.title || "-",
            station_name: item.station_name || "-",
            created_by: item.created_by || "-",
            date: item.date?.split("T")[0] || "",
            status: item.status || "-",
            action: "",
            mocClosure: "",
          }));
          setTableData(formatted);
        } else {
          console.error("⚠️ Invalid MOC data:", res.data);
        }
      } catch (error) {
        console.error("🚨 Failed to fetch MOC table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMocData();
  }, []);

  const handleClickViewAction = (row: IMOCTableRow) => {
    navigate(`/station-operations/${encodeURIComponent(row.moc_request_no)}`)
  };
  const handleDeleteAction = (row: IMOCTableRow) => console.log("Delete:", row);
  const handleClickEditAction = (infoSelectedRow: Record<string, any>) => { };

  // 🔹 UNIFIED FILTER LOGIC
  const filteredData = tableData.filter((row) => {
    const q = searchQuery.toLowerCase();

    // 1. Quick Search Filter
    const matchesSearch =
      row.moc_request_no.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q) ||
      row.station_name.toLowerCase().includes(q) ||
      row.created_by.toLowerCase().includes(q) ||
      row.date.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.slNo.toString().includes(q);

    // 2. Main Dropdowns (Time & Station)
    const matchesStation = !selectedStation || row.station_name === selectedStation;
    let matchesDays = true;
    if (selectedDays !== null) {
      const rowDate = new Date(row.date);
      if (!isNaN(rowDate.getTime())) {
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - rowDate.getTime()) / (1000 * 60 * 60 * 24));
        matchesDays = diffDays <= selectedDays;
      }
    }

    // 3. ADVANCED FILTER BOX LOGIC (ActiveFilters state)
    let matchesAdvanced = true;

    // Requestor
    if (activeFilters.created_by && row.created_by !== activeFilters.created_by) {
      matchesAdvanced = false;
    }
    // Request No
    if (matchesAdvanced && activeFilters.moc_request_no && row.moc_request_no !== activeFilters.moc_request_no) {
      matchesAdvanced = false;
    }
    // Status
    if (matchesAdvanced && activeFilters.status && row.status !== activeFilters.status) {
      matchesAdvanced = false;
    }
    // Date Range (Start Date)
    if (matchesAdvanced && activeFilters.startDate) {
      if (row.date < activeFilters.startDate) { // Comparing YYYY-MM-DD strings works
        matchesAdvanced = false;
      }
    }
    // Date Range (End Date)
    if (matchesAdvanced && activeFilters.endDate) {
      if (row.date > activeFilters.endDate) { // Comparing YYYY-MM-DD strings works
        matchesAdvanced = false;
      }
    }

    return matchesSearch && matchesStation && matchesDays && matchesAdvanced;
  });

  // Use all filtered data (no pagination)
  const currentItems = filteredData.map((item, idx) => ({
    ...item,
    serialNumber: idx + 1,
  }));

  const renderModal = () => <div>Modal Content</div>;
  const renderDeleteModal = () => <div>Delete Modal Content</div>;

  return (
    <div className="flex flex-col h-screen overflow-visible">
      <div className="rounded-md mb-2 mt-2">
        <MocTopHeader
          title="All Moc Requests"
          subTitle="Browse and filter all change requests"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        {/* Search bar */}
        <div className="w-1/2 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title, request number, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-1 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Right aligned dropdown */}
        <div className="ml-auto">
          <MocDropdown
            onStationSelect={setSelectedStation}
            onTimeSelect={setSelectedDays}
            onApplyFilter={(filters) => {
              setActiveFilters(filters as MocFilters);
              setTriggerFilter(prev => prev + 1);
            }}
            mocData={tableData}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div>Loading...</div>
          </div>
        ) : (
          <BasicTable
            tableHeader={MOC_HEADER_DATA}
            tableData={currentItems as any}
            handleClickEditAction={handleClickEditAction}
            handleClickViewAction={handleClickViewAction as unknown as (row: any) => void}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            showAddButton={false}
            maxHeight="none"
          />
        )}
      </div>
      <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
        <button
          onClick={() => navigate(-1)} // go back to previous page
          className="border border-gray-400 hover:bg-gray-300 text-gray-800 text-xs px-5 py-2 rounded-lg shadow-sm transition"
        >
          Close
        </button>
      </div>

      {modal && renderModal()}
      {modalDelete && renderDeleteModal()}
    </div>
  );
};

export default MocViewAll;

