import React, { useState, useEffect } from "react";
import GatePassCards from "./GatePassCards";
import GPBasicTable from "../tables/GPBasicTable";
import { GATEPASS_HEADER_DATA, GP_RETURNABLE_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import GPTypeFilter from "../GatePass/GPTypeFilter";
import InwardOutward from "../GatePassInward/InwardOutward";
import { toast } from "react-toastify";
import GPReturnableBasicTable from "../tables/GPReturnableBasicTable";
import MocTopHeader from "../moc/MocTopHeader";

interface GatePassRow {
  gate_pass_no: string;
  formtype: string;
  status: string;
  date_time: string;
  station: string;
  purpose: string;
  created_by: string;
  outward_id?: string;
  user_id: string;   // 🔥 REQUIRED
  returnable: boolean;
  returnable_gate_pass_no: string;
  inward_id?: string;
}

const GatePassDashboard: React.FC = () => {
  const [tableData, setTableData] = useState<GatePassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Outward Passes");
  const [searchQuery, setSearchQuery] = useState("");
  const handleCardClick = (cardTitle: string) => toast.success(`${cardTitle} clicked!`);
  const navigate = useNavigate();
  const handleClickEditAction = (infoSelectedRow: Record<string, any>) => { };


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

  const storedUser = localStorage.getItem("userData");
  const userId = storedUser ? JSON.parse(storedUser)?.userId : null;

  const API_MAP: Record<string, string> = {
    "All": `/api/GatePass/other/user/${userId}`,
    "Inward Passes": `/api/GatePass/IG/IGgetall/${userId}`,
    "Returnable Tracker": `/api/GatePassRG/station/${userId}`,
    "Outward Passes": `/api/GatePass/OG/GetAllOutwardGatePass/${userId}`,
  };

  console.log("API_MAPdas", API_MAP);


  // ---------- 📌 FORMATTER MAP (Shapes vary by API) ----------
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

    user_id: item.user_id ?? "-", // ✅ REQUIRED FIELD
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
        case "All": {
          const main = res.data?.data || {};
          rawData = [
            ...(main.inward || []),
            ...(main.outward || []),
            ...(main.returnable || []),
          ];
          break;
        }

        case "Returnable Tracker":
          rawData = res.data?.data || [];
          break;

        case "Outward Passes":
          rawData = res.data?.data || [];
          break;

        default:
          rawData = res.data?.data || res.data || [];
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
  }, [selectedTab]);
  return (
    <div className="h-screen bg-gray-50 flex flex-col -ml-2">
      <div className="mb-2 mt-1 ml-1 rounded-md">
        <MocTopHeader
          title="Gate Pass Management System"
          subTitle="PMHBL - Professional Material Handling"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* ---------- Static Content (Non-scrollable) ---------- */}
      <div className="space-y-2 flex-shrink-0">
        <GatePassCards />
        <InwardOutward />
      </div>

      {/* ----------Type Filter ---------- */}
      <div className="flex items-center justify-between p-1 gap-2">
        <div className="flex-1 min-w-0 overflow-x-auto hide-scrollbar">
          <GPTypeFilter onTabSelect={(t) => setSelectedTab(t)} />
        </div>
        <button
          className="flex-shrink-0 flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white 
         px-2 py-1 text-[10px] font-medium text-primary shadow-sm hover:bg-primary hover:text-white 
         focus:outline-none focus:ring-2 focus:ring-primary shadow-[#010810]
         sm:px-3 sm:py-2 sm:text-xs md:text-sm"
          onClick={() => navigate("/station-operations/gate-pass/AllGatePassList")}
        >
          View All
        </button>
      </div>

      {/* ---------- Scrollable Table Section ---------- */}
      <div className="flex-1 overflow-auto hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : selectedTab === "Returnable Tracker" ? (
          <GPReturnableBasicTable
            tableHeader={GP_RETURNABLE_HEADER_DATA}
            tableData={tableData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleClickViewAction={
              handleClickViewAction as unknown as (row: any) => void
            }
            showAddButton={false}
            maxHeight="none"
            currentPage={0}
            itemsPerPage={0}
          />
        ) : (
          <GPBasicTable
            tableHeader={GATEPASS_HEADER_DATA}
            tableData={tableData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleClickViewAction={
              handleClickViewAction as unknown as (row: any) => void
            }
            showAddButton={false}
            maxHeight="none"
            currentPage={0}
            itemsPerPage={0}
          />
        )}
      </div>
    </div>
  );
};

export default GatePassDashboard;


