import React, { useEffect, useMemo, useState } from "react";
import { HR_EMP_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Search, FileUp } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import HRTopHeader from "./HRTopHeader";
import BasicTable from "../tables/BasicTable";
import HRAssetDeclarationForm from "./HRAssetDeclarationForm";
import HREmpFilter from "./HREmpFilter";
import HRBasicTable from "./HRBasicTable";
 
interface MocFilters {
    station: string;
    employment_type: string;
    station_name: string;
 
}
 
interface GatePassRow {
    gate_pass_no: string;
    outward_id: string;
    formtype: string;
    status: string;
    date_time: string;
    station: string;
    employment_type: string;
    station_name: string;
    purpose: string;
    created_by: string;
    returnable: boolean;
    inward_id: string;
    returnable_gate_pass_no: string;
}
 
const HRDashboard = () => {
    const navigate = useNavigate();
    const [declarationData, setDeclarationData] = useState(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
 
    const [activeFilters, setActiveFilters] = useState<MocFilters>({
        station: "",
        employment_type: "",
        station_name: "",
    });
 
    const [selectedStation, setSelectedStation] = useState<string>("");
    const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentPage] = useState(1);
    const [itemsPerPage] = useState(1000);
 
    const storedUser = localStorage.getItem("userData");
    const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const roleName = parsedUser?.roleName;
 
    const fetchGatePassData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/usersProfile/`);
 
            const formattedRows = res.data.map((item: any) => ({
                user_id: item.user_id,
                username: item.username,
                first_name: item.first_name,
                last_name: item.last_name,
                email: item.email,
                contact_phone: item.contact_phone,
                station_name: item.station_name,
                role: item.role?.role_name,
                designation: item.designation ?? "-",
                dob: item.dob ?? "-",
                grade: item.grade ?? "-",
                employee_code: item.employee_code ?? "-",
                date_of_joining: item.date_of_joining ?? "-",
                supervisor_name: item.supervisor_name ?? "-",
                job_type: item.job_type ?? "-",
                status: item.status,
            }));
 
            setTableData(formattedRows);
 
        } catch (error) {
            console.error("API fetch failed:", error);
            toast.error("Failed to fetch employee data");
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => {
        fetchGatePassData();
    }, []);
 
    // ✅ FIXED SEARCH LOGIC FOR EMPLOYEE DATA
    const filteredData = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
 
        return tableData.filter((row: any) => {
            const values = Object.values(row)
            .map((v) => (v != null ? v.toString().toLowerCase() : ""))
            .join(" ");
 
            if (q && !values.includes(q)) return false;
 
            if (selectedStation && row.station_name !== selectedStation) return false;
            if (selectedEmploymentType && row.job_type !== selectedEmploymentType) return false;
            if (activeFilters.station_name && row.station_name !== activeFilters.station_name)
                return false;
            if (activeFilters.employment_type && row.job_type !== activeFilters.employment_type)
                return false;
            return true;
        });
    }, [tableData, searchQuery, selectedStation,selectedEmploymentType ,activeFilters]);
 
    const currentItems = useMemo(
        () => filteredData.map((item, idx) => ({ ...item, serialNumber: idx + 1 })),
        [filteredData]
    );
 
    const updatedItems = currentItems.map((item: any) => ({
        ...item,
        full_name: `${item.first_name} ${item.last_name}`,
    }));
 
    const handleExport = () => {
        if (!filteredData.length) {
            toast.error("No data available to export.");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "EmployeeData");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });
        saveAs(blob, `EmployeeData_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };
 
    const fetchDeclarationData = async () => {
        try {
            const res = await api.get(`/api/declaration/`);
            setDeclarationData(res.data);
        } catch (error) {
            console.error("Declaration fetch failed:", error);
            toast.error("Failed to fetch declaration data");
        }
    };
 
    return (
        <div className="flex flex-col h-screen overflow-visible">
            <div className="rounded-md mb-2 mt-1">
                <HRTopHeader
                    title="Employee Personal Information"
                    subTitle="Manage employee records and declarations"
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddClick={() =>
                        navigate('/user-management/manage-user/edit-profile/', {
                            state: { shouldFetch: false }
                        })
                    }
                    onAssetClick={() => {
                        fetchDeclarationData();
                        setIsFormOpen(true);
                    }}
                    showAddButton={roleName === "HR"}
                />
 
                <HRAssetDeclarationForm
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    declarationData={declarationData || []}
                    onSubmit={(data) => {
                        console.log('Form submitted:', data);
                        setIsFormOpen(false);
                        toast.success('Asset declaration submitted successfully!');
                    }}
                />
            </div>
 
            <div className="flex items-center justify-between mb-2">
                <div className="w-1/2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-1 pl-10 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
 
                <div className="flex items-center gap-3 ml-auto">
                    <HREmpFilter
                        onStationSelect={(s) => setSelectedStation(s)}
                        onEmploymentTypeSelect={(et) => setSelectedEmploymentType(et)}
                        onApplyFilter={(filters) => setActiveFilters(filters)}
                        mocData={tableData}
                    />
 
                    <button
                        onClick={handleExport}
                        className="mr-5 flex items-center gap-2 border bg-green-500 px-4 py-2 rounded-lg text-xs shadow-sm hover:bg-gray-100"
                    >
                        <FileUp size={16} />
                        Export
                    </button>
                </div>
            </div>
 
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto hide-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            Loading...
                        </div>
                    ) : (
                        <HRBasicTable
                            tableHeader={HR_EMP_HEADER_DATA}
                            tableData={updatedItems}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
 
export default HRDashboard;