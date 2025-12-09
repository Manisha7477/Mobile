import React, { useEffect, useMemo, useState } from "react";
import { GATEPASS_HEADER_DATA, GP_RETURNABLE_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Search, FileUp } from "lucide-react";
import MocTopHeader from "../moc/MocTopHeader";
import GPFilterDD from "../GatePass/GPFilterDD";
import GPTypeFilter from "./GPTypeFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import GPBasicTable from "../tables/GPBasicTable";
import { toast } from "react-toastify";
import GPReturnableBasicTable from "../tables/GPReturnableBasicTable";
// Interface for filters
interface MocFilters {
  station: string;
  gate_pass_no: string;
  created_by: string;
  status: string;
  startDate: string;
  endDate: string;
  returnable_gate_pass_no: string;
}

interface GatePassRow {
  gate_pass_no: string;
  outward_id: string;
  formtype: string;
  status: string;
  date_time: string;
  station: string;
  purpose: string;
  created_by: string;
  returnable: boolean;
  inward_id: string;
  returnable_gate_pass_no: string;
}

const ViewAllGatePass = () => {
  const navigate = useNavigate();

  // UI States
  const [tableData, setTableData] = useState<GatePassRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("Outward Passes");
  const [loading, setLoading] = useState(false);

  // Filters
  const [activeFilters, setActiveFilters] = useState<MocFilters>({
    station: "",
    created_by: "",
    gate_pass_no: "",
    status: "",
    startDate: "",
    endDate: "",
    returnable_gate_pass_no: "",
  });

  // selected station from filter dropdown (used to restrict gate_pass_no and rows)
  const [selectedStation, setSelectedStation] = useState<string>("");

  // pagination / table control required by GPBasicTable
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1000);

  // Read userId once
  const storedUser = localStorage.getItem("userData");
  const userId = storedUser ? JSON.parse(storedUser)?.userId : null;

  // ---------- 📌 API MAP (No switch-case needed) ----------
  const API_MAP: Record<string, string> = {
    "All": `/api/GatePass/other/user/${userId}`,
    "Inward Passes": `/api/GatePass/IG/IGgetall/${userId}`,
    "Returnable Tracker": `/api/GatePassRG/station/${userId}`,
    "Outward Passes": `/api/GatePass/OG/GetAllOutwardGatePass/${userId}`,
  };

  const formatRecord = (item: any) => ({
    station:
      selectedTab === "Returnable Tracker" || selectedTab === "All"
        ? item?.outward_details?.station ?? item?.station ?? "-"
        : item?.station ?? "-",
    purpose:
      selectedTab === "Returnable Tracker" || selectedTab === "All"
        ? item?.outward_details?.purpose ?? item?.purpose ?? "-"
        : item?.purpose ?? "-",
    returnable_gate_pass_no:
      selectedTab === "Returnable Tracker" || selectedTab === "All"
        ? item?.outward_details?.returnable_gate_pass_no ??
        item?.returnable_gate_pass_no ??
        "-"
        : item?.returnable_gate_pass_no ?? "-",
    returnable:
      Array.isArray(item.materials)
        ? item.materials.some((m: any) => m.returnable === true)
        : Array.isArray(item.materials?.[0])
          ? item.materials[0].some((m: any) => m.returnable === true)
          : false,
    approver_id: item.approver_id,
    outward_id: item.outward_id,
    inward_id: item.inward_id,
    gate_pass_no: item.gate_pass_no ?? "-",
    formtype: item.formtype ?? "-",
    status: item.status ?? "-",
    date_time:
      item.date_time
        ? new Date(item.date_time).toLocaleString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "-",
    created_by: item.created_by ?? "-",
    // keep raw_date if available for date comparisons
  });

  // ---------- 📌 Fetch Function ----------
  const fetchGatePassData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const endpoint = API_MAP[selectedTab];
      const res = await api.get(endpoint);

      let rawData: any[] = [];


      switch (selectedTab) {
        case "All":
          const main = res.data?.data || {};

          rawData = [
            ...(main.inward || []),
            ...(main.outward || []),
            ...(main.returnable || []),
          ];
          break;

        case "Outward Passes":
          rawData = res.data?.data || [];
          break;

        case "Returnable Tracker":
        case "All":
          rawData = res.data?.data || [];
          break;
        default:
          rawData = res.data || [];
          break;
      }

      // ---------- 📌 2. Format all records ----------
      const formattedRows = rawData.map((item) => formatRecord(item));

      // ---------- 📌 3. Store in table ----------
      setTableData(formattedRows);
    } catch (error) {
      console.error("API fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- 📌 Single useEffect (Runs only when tab changes) ----------
  useEffect(() => {
    fetchGatePassData();
    // reset selection when tab changes
    setSelectedStation("");
    setActiveFilters({
      station: "",
      created_by: "",
      gate_pass_no: "",
      status: "",
      startDate: "",
      endDate: "",
      returnable_gate_pass_no: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  // ---------- 📌 Export Excel ----------
  const handleExport = () => {
    if (!filteredData.length) {
      toast.error("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GatePassData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `GatePassData_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ---------- 📌 View Action ----------
  
const handleClickViewAction = (row: GatePassRow) => {
  console.log("Selected Row:", row);  // debug
 
  // INWARD
  if (row.inward_id) {
    navigate(`/station-operations/inward/view/${row.inward_id}`);
    return;
  }
 
  // OUTWARD
  if (row.outward_id) {
    navigate(`/station-operations/outward/view/${row.outward_id}`);
    return;
  }
 
  // RETURNABLE TRACKER (if you have a returnable page)
  if (row.returnable) {
    navigate(`/station-operations/returnable/view/${row.gate_pass_no}`);
    return;
  }
 
  toast.error("Unable to determine gate pass type.");
};
 
 
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const roleName = parsedUser?.roleName;
  // ---------- 📌 Filtered data (applies search, selectedStation and advanced filters) ----------
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tableData.filter((row) => {
      // quick search across visible columns
      const matchesSearch =
        !q ||
        (row.gate_pass_no && row.gate_pass_no.toLowerCase().includes(q)) ||
        (row.returnable_gate_pass_no && row.returnable_gate_pass_no.toLowerCase().includes(q)) ||
        (row.formtype && row.formtype.toLowerCase().includes(q)) ||
        (row.station && row.station.toLowerCase().includes(q)) ||
        (row.purpose && row.purpose.toLowerCase().includes(q)) ||
        (row.created_by && row.created_by.toLowerCase().includes(q)) ||
        (row.status && row.status.toLowerCase().includes(q)) ||
        (row.date_time && row.date_time.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // station selection must match if set
      if (selectedStation && row.station !== selectedStation) return false;

      // advanced filters
      if (activeFilters.station && row.station !== activeFilters.station) return false;

      // gate_pass_no filter: must match if provided (station restriction already applied)
      if (activeFilters.gate_pass_no && row.gate_pass_no !== activeFilters.gate_pass_no) return false;

      if (activeFilters.status && row.status !== activeFilters.status) return false;

      // date range filter using raw_date if available
      if (activeFilters.startDate) {
        const rowTime = new Date(row.date_time).getTime();
        const startTime = new Date(activeFilters.startDate).getTime();
        if (!isNaN(startTime) && !isNaN(rowTime) && rowTime < startTime) return false;
      }
      if (activeFilters.endDate) {
        const rowTime = new Date(row.date_time).getTime();
        const endTime = new Date(activeFilters.endDate).getTime();
        if (!isNaN(endTime) && !isNaN(rowTime) && rowTime > endTime) return false;
      }

      return true;
    });
  }, [tableData, searchQuery, selectedStation, activeFilters]);

  const currentItems = useMemo(
    () => filteredData.map((item, idx) => ({ ...item, serialNumber: idx + 1 })),
    [filteredData]
  );
  console.log("filterdat", filteredData);


  return (
    <div className="flex flex-col h-screen overflow-visible">
      {/* Header */}
      <div className="rounded-md mb-2 mt-2">
        <MocTopHeader
          title="All Gate Passes"
          subTitle="View, print, and manage all gate passes"
        />
      </div>

      {/* Search + Filter + Export */}
      <div className="flex items-center justify-between mb-2">
        {/* Search */}
        <div className="w-1/2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, name, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-1 pl-10 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Filters + Export */}
        <div className="flex items-center gap-3 ml-auto">
          <GPFilterDD
            onStationSelect={(s) => setSelectedStation(s)}
            onApplyFilter={(filters) => setActiveFilters(filters)}
            mocData={tableData}
          />

          <button
            onClick={handleExport}
            className="flex items-center gap-2 border bg-green-500 px-4 py-2 rounded-lg text-xs shadow-sm hover:bg-gray-100"
          >
            <FileUp size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <GPTypeFilter onTabSelect={(t) => setSelectedTab(t)} />

      {/* Table */}
      <div className="flex-1 overflow-x-hidden hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : selectedTab === "Returnable Tracker" ? (
          <GPReturnableBasicTable
            tableHeader={GP_RETURNABLE_HEADER_DATA}
            tableData={currentItems as any}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleClickViewAction={
              handleClickViewAction as unknown as (row: any) => void
            }
            showAddButton={false}
            maxHeight="none"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        ) : (
          <GPBasicTable
            tableHeader={GATEPASS_HEADER_DATA}
            tableData={currentItems as any}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleClickViewAction={
              handleClickViewAction as unknown as (row: any) => void
            }
            showAddButton={false}
            maxHeight="none"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
      {roleName !== "Security" && (
        <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-400 px-5 py-2 text-xs rounded-lg shadow-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAllGatePass;
