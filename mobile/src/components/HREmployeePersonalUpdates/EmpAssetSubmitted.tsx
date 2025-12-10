import React, { useEffect, useMemo, useState } from "react";
import { ASSET_PERSONAL_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Search, FileUp, ChevronDown } from "lucide-react";
import MocTopHeader from "../moc/MocTopHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import GPBasicTable from "../tables/GPBasicTable";
import { toast } from "react-toastify";
import HRTypeFilter from "./HRTypeFilter";

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
  financial_year?: string;
  returnable_gate_pass_no: string;
}

const EmpAssetSubmitted = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<GatePassRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Submissions");
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<MocFilters>({
    station: "",
    created_by: "",
    gate_pass_no: "",
    status: "",
    startDate: "",
    endDate: "",
    returnable_gate_pass_no: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1000);
  const [selectedTime, setSelectedTime] = useState("All Years");
  const storedUser = localStorage.getItem("userData");
  const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
  const API_MAP: Record<string, string> = {
    "All Submissions": `/api/all-combined-emplyee_info/user/${userId}`,
    "Asset Declaration": `/api/asset-declaration/user/${userId}`,
    "Annual Investment": `/api/finance/user/${userId}`,
    "Form 12 C": `/api/form12c/user/${userId}`,
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
            user_id: item.user_id || "-",
            employee_full_name: item.employee_full_name || "-",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.user_id || item.id
          }));
          const annual = (main.user_finance || []).map((item: any) => ({
            submissionType: "Annual Investment",
            user_id: item.user_id || "-",
            employee_full_name: item.employee_full_name || "-",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.user_finance_id || item.id,
          }));
          const form12c = (main.employee_form_12c || []).map((item: any) => ({
            submissionType: "Form 12 C",
            user_id: item.user_id || "-",
            employee_full_name: item.employee_full_name || "-",
            financial_year: item.financial_year || "-",
            date: item.declared_date || "-",
            status: item.status || "-",
            action: item.form_id || item.id,
          }));
          formattedRows = [...assets, ...annual, ...form12c];
          break;
        }
        case "Asset Declaration": {
          const raw = res.data;
          if (!raw) {
            formattedRows = [];
            break;
          }
          const rows = Array.isArray(raw) ? raw : [raw];
          formattedRows = rows.map((item: any) => ({
            employee_full_name: item.employee_full_name || "-",
            submissionType: "Asset Declaration",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.asset_id,
          }));
          break;
        }
        case "Annual Investment": {
          const raw = res.data;
          if (!raw) {
            formattedRows = [];
            break;
          }
          const rows = Array.isArray(raw) ? raw : [raw];
          formattedRows = rows.map((item: any) => ({
            employee_full_name: `${item.first_name} ${item.last_name}`.trim() || "-",
            submissionType: "Annual Investment",
            financial_year: item.financial_year || "-",
            date: item.date || "-",
            status: item.status || "-",
            action: item.finance_id,
          }));
          break;
        }
        case "Form 12 C": {
          const raw = res.data;
          if (!raw) {
            formattedRows = [];
            break;
          }
          const rows = Array.isArray(raw) ? raw : [raw];
          formattedRows = rows.map((item: any) => ({
            employee_full_name: item.employee_full_name || "-",
            submissionType: "Form 12 C",
            financial_year: item.financial_year || "-",
            date: item.declared_date || "-",
            status: item.status || "-",
            action: item.form_id,
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
  const handleClickViewAction = (row: any) => {
    if (row.submissionType === "Asset Declaration") {
      navigate(`/hr-admin/asset-declaration/view/${row.action}`);
      return;
    }
    if (row.submissionType === "Annual Investment") {
      navigate(`/hr-admin/annual-investment/view/${row.action}`);
      return;
    }
    if (row.submissionType === "Form 12 C") {
      navigate(`/hr-admin/form12c/view/${row.action}`);
      return;
    }
    toast.error("Unable to determine item type.");
  };
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tableData.filter((row) => {
      const values = Object.values(row)
        .map((v) => (v != null ? v.toString().toLowerCase() : ""))
        .join(" ");

      if (q && !values.includes(q)) return false;
      if (selectedTime !== "All Years" && row.financial_year !== selectedTime)
        return false;
      return true;
    });
  }, [tableData, searchQuery, selectedTime, activeFilters]);

  const currentItems = useMemo(
    () => filteredData.map((item, idx) => ({ ...item, serialNumber: idx + 1 })),
    [filteredData]
  );

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
            tableHeader={ASSET_PERSONAL_HEADER_DATA}
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
      <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
        <button
          onClick={() => navigate(`/user-management/manage-user/edit-profile/${parsedUser?.userId}`)}
          className="border border-gray-400 px-5 py-2 text-xs rounded-lg shadow-sm hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EmpAssetSubmitted;