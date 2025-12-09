import React, { useEffect, useState } from "react";
import { LEAVE_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { MocFilters } from "../moc/MocDropdown";
import LeaveTopHeader from "./LeaveTopHeader";
import LeaveTopCards from "./LeaveTopCards";
import LeaveBasicTable from "../tables/LeaveBasicTable";
import LeaveTabs from "./LeaveTabs";
import LeaveApprovals from "../LeaveManagerTabs/LeaveApprovals";
import LeaveLedger from "../LeaveManagerTabs/LeaveLedger";
import LeavePublicHolidays from "../LeaveManagerTabs/LeavePublicHolidays";
import LeaveAnalytics from "../LeaveManagerTabs/LeaveAnalytics";
import ApplyLeaveForm from "./ApplyLeaveForm";
import MiniCalendar from "../Dashboard/MiniCalendar";
import LeaveInfo from "./LeaveInfo";
interface ILeaveRow {
    slNo: number;
    leave_id: number;
    user_id: number;
    supervisor_id: number;
    supervisor_name: string;
    user_name: string;
    leave_type: string;
    from_date: string;
    to_date: string;
    number_of_days: number;
    reason: string;
    document_path: string;
    contact_address: string;
    phone_number: string;
    reversal_from_date: string | null;
    reversal_to_date: string | null;
    reversal_remarks: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    supervisor_remarks: string | null;

    leave_days: {
        leave_day_id: number;
        leave_date: string;
        day_type: string;
        half_session: string | null;
    }[];
}


const LeaveDashboard = () => {
    const [tableData, setTableData] = useState<ILeaveRow[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDays, setSelectedDays] = useState<number | null>(null);
    const [isLeaveInfoOpen, setIsLeaveInfoOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const storedUser = localStorage.getItem("userData");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const roleName = parsedUser?.roleName;
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchLeaveData = async () => {
            try {
                setLoading(true);
                const userId = parsedUser?.userId;
                const res = await api.get(`/api/leave/my/${userId}`);
                const records = res.data || [];
                if (Array.isArray(records)) {
                    const formatted = records.map((item: any, idx: number) => {
                        const header = item.leave_header;
                        const leaveDays = item.leave_days || [];
                        return {
                            slNo: idx + 1,
                            leave_id: header.leave_id,
                            user_id: header.user_id,
                            supervisor_id: header.supervisor_id,
                            supervisor_name: header.supervisor_name,
                            user_name: header.user_name,
                            leave_type: header.leave_type,
                            from_date: header.from_date,
                            to_date: header.to_date,
                            dateDuration: `${header.from_date} - ${header.to_date}`,
                            number_of_days: header.number_of_days,
                            reason: header.reason,
                            document_path: header.document_path,
                            contact_address: header.contact_address,
                            phone_number: header.phone_number,
                            reversal_from_date: header.reversal_from_date,
                            reversal_to_date: header.reversal_to_date,
                            reversal_remarks: header.reversal_remarks,
                            status: header.status,
                            created_at: header.created_at?.split("T")[0] ?? "",
                            updated_at: header.updated_at?.split("T")[0] ?? "",
                            supervisor_remarks: header.supervisor_remarks,
                            leave_days: leaveDays.map((day: any) => ({
                                leave_day_id: day.leave_day_id,
                                leave_date: day.leave_date,
                                day_type: day.day_type,
                                half_session: day.half_session,
                            })),
                        };
                    });
                    setTableData(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch leave data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaveData();
    }, []);

    const filteredData = tableData.filter((row) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            row.leave_type.toLowerCase().includes(q) ||
            row.user_name.toLowerCase().includes(q) ||
            row.status.toLowerCase().includes(q);
        const matchesStation = true;
        let matchesDays = true;
        if (selectedDays) {
            const rowDate = new Date(row.created_at);
            const today = new Date();
            const diffDays = Math.floor((today.getTime() - rowDate.getTime()) / (1000 * 60 * 60 * 24));
            matchesDays = diffDays <= selectedDays;
        }
        return matchesSearch && matchesStation && matchesDays;
    });
    const currentItems = filteredData.map((item, idx) => ({
        ...item,
        serialNumber: idx + 1,
    }));

    const getDatesBetween = (start: string, end: string) => {
        const dates = [];
        let current = new Date(start);
        const last = new Date(end);
 
        while (current <= last) {
            const iso = current.toISOString().split("T")[0];
            dates.push(iso);
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };
 
    const leaveHighlights = tableData.flatMap((row) => {
        const fullDates = getDatesBetween(row.from_date, row.to_date);
 
        return fullDates.map((d) => ({
            date: d,
            type: row.leave_type,
        }));
    });
 
    return (
        <div className="h-screen flex flex-col overflow-hidden -ml-2">
            <div className="mb-2 mt-1 ml-1 rounded-md">
                <LeaveTopHeader
                    title="Leave Management"
                    subTitle="Manage Leave Controle Panel"
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddClick={() => setIsModalOpen(true)}
                    showAddButton={true}
                    onInfoClick={() => setIsLeaveInfoOpen(true)}

                />
                <LeaveTabs activeTab={activeTab} onTabChange={setActiveTab} roleName={roleName} />
            </div>
            {activeTab === "Dashboard" && (
                <>
                    <div className="rounded-md">
                        <LeaveTopCards />
                    </div>
                    <div className="w-full overflow-x-auto hide-scrollbar">
                        <div className="flex flex-row gap-4 items-start sm:min-w-full">
                            {/* LEFT SIDE */}
                            <div className="flex-1">
                                <h3 className="text-black text-2xl font-bold ml-2 mt-2 mb-1">
                                    Leave Status Tracker
                                </h3>
                                <div className="flex-1 overflow-auto hide-scrollbar">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div>Loading...</div>
                                        </div>
                                    ) : (
                                        <LeaveBasicTable
                                            tableHeader={LEAVE_HEADER_DATA}
                                            tableData={currentItems as any}
                                            currentPage={currentPage}
                                            itemsPerPage={itemsPerPage}
                                            showAddButton={false}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* RIGHT SIDE – MINI CALENDAR */}
                            <div className="-ml-2 w-[320px] sm:w-[380px] mt-2">
                                <MiniCalendar
                                highlightDates={leaveHighlights}
                                 />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {activeTab === "Requests" && <LeaveApprovals />}
            {activeTab === "Ledger" && <LeaveLedger />}
            {activeTab === "PublicHolidays" && <LeavePublicHolidays />}
            {activeTab === "Leave Allocation" && <LeaveAnalytics />}
            {isModalOpen && (
                <ApplyLeaveForm onClose={() => setIsModalOpen(false)} />
            )}
            {isLeaveInfoOpen && (
                <LeaveInfo onClose={() => setIsLeaveInfoOpen(false)} />
            )}

        </div>
    );
};

export default LeaveDashboard;
