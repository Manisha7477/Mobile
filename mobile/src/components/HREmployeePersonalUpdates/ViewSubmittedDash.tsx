import React, { useEffect, useMemo, useState } from "react";
import { ASSET_EMP_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Search, FileUp, ChevronDown } from "lucide-react";
import MocTopHeader from "../moc/MocTopHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import GPBasicTable from "../tables/GPBasicTable";
import { toast } from "react-toastify";
import HRTypeFilter from "./HRTypeFilter";
import AssetFilter from "./AssetFilter";
interface MocFilters {
  employee_code: string;
  status: string;
  station: string;
  gate_pass_no: string;
  created_by: string;
  startDate: string;
  endDate: string;
  returnable_gate_pass_no: string;
}
interface GatePassRow {
  gate_pass_no?: string;
  financial_year?: string;
  [key: string]: any;
}

const ViewSubmittedDash = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<GatePassRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Submissions");
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<MocFilters>({
    employee_code: "",
    status: "",
    station: "",
    created_by: "",
    gate_pass_no: "",
    startDate: "",
    endDate: "",
    returnable_gate_pass_no: "",
  });
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("All Years");
  const storedUser = localStorage.getItem("userData");
  const userId = storedUser ? JSON.parse(storedUser)?.userId : null;

  const API_MAP: Record<string, string> = {
    "All Submissions": `/api/all-combined-emplyee_info/all`,
    "Asset Declaration": `/api/asset-declaration/`,
    "Annual Investment": `/api/finance/`,
    "Form 12 C": `/api/form12c/`,
  };

  const formatRecord = (item: any) => ({
    ...item,
    financial_year: item.financial_year || "-",
  });

  const fetchGatePassData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(API_MAP[selectedTab]);
      let rawData: any[] = [];
      let formattedRows: any[] = [];
      switch (selectedTab) {
        case "All Submissions": {
          const main = res.data || {};
          const assets = (main.asset_declaration || []).map((item: any) => ({
            submissionType: "Asset Declaration",
            employee_code: item.employee_code || "-",
            employee_full_name: item.employee_full_name || "-",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.user_id || item.id,
          }));
          const annual = (main.user_finance || []).map((item: any) => ({
            submissionType: "Annual Investment",
            employee_code: item.employee_code || "-",
            employee_full_name: item.employee_full_name || "-",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.user_finance_id,
          }));
          const form12c = (main.employee_form_12c || []).map((item: any) => ({
            submissionType: "Form 12 C",
            employee_code: item.employee_code || "-",
            employee_full_name: item.employee_full_name || "-",
            financial_year: item.financial_year || "-",
            date: item.declared_date || "-",
            status: item.status || "-",
            action: item.form_id,
          }));
          formattedRows = [...assets, ...annual, ...form12c];
          break;
        }
        case "Asset Declaration": {
          const raw =
            Array.isArray(res.data?.data) ? res.data.data : res.data;
          formattedRows = raw.map((item: any) => ({
            employee_full_name: item.employee_full_name || "-",
            employee_code: item.employee_code || "-",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.user_id || item.id,
            submissionType: "Asset Declaration",
          }));
          break;
        }
        case "Annual Investment": {
          const raw =
            Array.isArray(res.data?.data) ? res.data.data : res.data;
          formattedRows = raw.map((item: any) => ({
            user_finance_id: item.user_finance_id,
            employee_full_name: `${item.first_name} ${item.last_name}`.trim() || "-",
            employee_code: item.employee_code || "-",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.asset_declaration_id || item.id,
            submissionType: "Annual Investment",

          }));
          break;
        }
        case "Form 12 C": {
          const raw =
            Array.isArray(res.data?.data) ? res.data.data : res.data;
          formattedRows = raw.map((item: any) => ({
            employee_full_name: item.employee_full_name || "-",
            employee_code: item.employee_code || "-",
            financial_year: item.financial_year || "-",
            date: item.declared_date || "-",
            status: item.status || "-",
            action: item.form_id,
            submissionType: "Form 12 C",
          }));
          break;
        }
        default:
          rawData = res.data || [];
          formattedRows = rawData.map((item) => formatRecord(item));
          break;
      }
      setTableData(formattedRows);
    } catch (error) {
      console.error("API fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };

  useEffect(() => {
    fetchGatePassData();
  }, [selectedTab]);

  const financialYears = useMemo(() => {
    const years = Array.from(
      new Set(tableData.map((row) => row.financial_year).filter(Boolean))
    );
    years.sort();
    return ["All Years", ...years];
  }, [tableData]);

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tableData.filter((row) => {
      const values = Object.values(row)
        .map((v) => (v != null ? v.toString().toLowerCase() : ""))
        .join(" ");
      if (q && !values.includes(q)) return false;
      if (selectedStation && row.station !== selectedStation) return false;
      if (selectedEmployeeCode && row.employee_code !== selectedEmployeeCode) return false;
      if (selectedTime !== "All Years" && row.financial_year !== selectedTime)
        return false;
      if (
        activeFilters.status &&
        row.status !== activeFilters.status
      )
        return false;
      if (
        activeFilters.gate_pass_no &&
        row.gate_pass_no !== activeFilters.gate_pass_no
      )
        return false;
      return true;
    });
  }, [tableData, searchQuery, selectedStation, selectedEmployeeCode, selectedTime, activeFilters]);

  const currentItems = useMemo(
    () => filteredData.map((item, idx) => ({ ...item, serialNumber: idx + 1 })),
    [filteredData]
  );

  const handleExport = () => {
    if (!filteredData.length) {
      toast.error("No data available to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GatePassData");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `GatePassData_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleClickViewAction = (row: GatePassRow) => {
    if ((row as any).submissionType === "Annual Investment" && (row as any).user_finance_id) {
      navigate(`/hr-admin/annual-investment/view/${(row as any).user_finance_id}`, { state: row });
      return;
    }
    if ((row as any).submissionType === "Asset Declaration") {
      const id = (row as any).action ?? (row as any).asset_declaration_id ?? (row as any).id;
      if (id) {
        navigate(`/hr-admin/asset-declaration/view/${row.action}`, { state: row });
        return;
      }

    }
    if (row.submissionType === "Form 12 C") {
      navigate(`/hr-admin/form12c/view/${row.action}`, { state: row });
      return;
    }
    if ((row as any).inward_id) {
      navigate(`/station-operations/inward/view/${(row as any).inward_id}`);
      return;
    }
    if ((row as any).outward_id) {
      navigate(`/station-operations/outward/view/${(row as any).outward_id}`);
      return;
    }
    if ((row as any).returnable && (row as any).gate_pass_no) {
      navigate(`/station-operations/returnable/view/${encodeURIComponent((row as any).gate_pass_no)}`);
      return;
    }
    toast.error("Unable to determine asset type.");
  };

  return (
    <div className="flex flex-col h-screen overflow-visible">
      <div className="rounded-md mb-2 mt-1">
        <MocTopHeader
          title="Asset & Investment Declaration"
          subTitle="View submitted declarations"
        />
      </div>
      <div className="flex items-center justify-between mb-2">
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
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative flex items-center">
            <select
              className="appearance-none border border-gray-300 rounded-lg pl-2 pr-8 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedTime}
              onChange={handleTimeChange}
            >
              {financialYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
          </div>
          <AssetFilter
            onApplyFilter={(filters) => {
              setActiveFilters(prev => ({ ...prev, ...filters }));
              if (filters.station) {
                setSelectedStation(filters.station);
              }
              if (filters.employee_code) {
                setSelectedEmployeeCode(filters.employee_code);
              }
            }}
            mocData={tableData}
          />
          <button
            onClick={handleExport}
            className="mr-5 flex items-center gap-2 border bg-green-500 px-4 py-2 rounded-md text-xs shadow-sm hover:bg-gray-100"
          >
            <FileUp size={16} />
            Export
          </button>
        </div>
      </div>
      <HRTypeFilter onTabSelect={(t) => setSelectedTab(t)} />
      <div className="flex-1 overflow-x-hidden hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : (
          <GPBasicTable
            tableHeader={ASSET_EMP_HEADER_DATA}
            tableData={currentItems as any}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleClickViewAction={handleClickViewAction as any}
            showAddButton={false}
            maxHeight="none" currentPage={0} itemsPerPage={0} />
        )}
      </div>
      <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
        <button
          onClick={() => navigate("/hr-admin/personal-updates")}
          className="border border-gray-400 px-5 py-2 text-xs rounded-lg shadow-sm hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewSubmittedDash;