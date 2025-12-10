import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import LeaveBasicTable from "../tables/LeaveBasicTable";
import { LEAVE_REQUESTS_HEADER_DATA } from "@/utils/data";
import LeaveReviewForm from "../LeaveManagement/LeaveReviewForm";

interface ILeaveRow {
  leave_id: number;
  user_name: string;
  leave_type_name: string;
  from_date: string;
  to_date: string;
  number_of_days: number;
  reason: string;
  status: string;
  created_at: string;
  supervisor_id: number | null;
  supervisor_name: string | null;
  updated_at:string;
}


const LeaveApprovals = () => {
  const [tableData, setTableData] = useState<ILeaveRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<ILeaveRow | null>(null);
  const [formMode, setFormMode] = useState<"view" | "review">("view");
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const roleName = parsedUser?.roleName;
  const supervisorId = parsedUser?.userId;

 const handleHiraReviewAction = (row: ILeaveRow) => {
  if (row.status?.toLowerCase() !== "pending") return;
  setSelectedLeave(row);
  setIsFormOpen(true);
  setFormMode("review"); // set mode explicitly for review
};

const handleClickViewAction = (row: ILeaveRow) => {
  setSelectedLeave(row);
  setIsFormOpen(true);
  setFormMode("view"); // set mode explicitly for view
};

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        setLoading(true);
        let res;

        if (roleName === "HR") {
          res = await api.get(`/api/leave/all`);
        } else if (roleName === "Supervisor") {
          res = await api.get(`/api/leave/sub/${supervisorId}`);
        } else {
          res = { data: [] };
        }

        // Normalize Backend Response
        const normalized = Array.isArray(res.data)
          ? res.data.map((item: any) => ({
            ...item.leave_header,
            leave_days: item.leave_days || [],
          }))
          : [];

        setTableData(normalized);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [roleName, supervisorId]);


  // const handleClickViewAction = (row: ILeaveRow) => {
  //   navigate(`/leave/${row.leave_id}`, { state: row });
  // };

  const handleClickEditAction = (row: ILeaveRow) => {
    navigate(`/leave/edit/${row.leave_id}`, { state: row });
  };

  const filteredData = tableData.filter((row) => {
    const q = searchQuery.toLowerCase();
    return (
      row.user_name?.toLowerCase().includes(q) ||
      row.leave_type_name?.toLowerCase().includes(q) ||
      row.reason?.toLowerCase().includes(q) ||
      row.status?.toLowerCase().includes(q)
    );
  });

  const currentItems = filteredData.map((item, idx) => ({
    ...item,
    serialNumber: idx + 1,
    employee_full_name: item.user_name || "",
    leaveType: item.leave_type_name || "-",
    dateDuration: `${item.from_date} - ${item.to_date}`,
    duration: item.number_of_days,
    appliedOn: item.created_at.split("T")[0],
    approved: item.supervisor_name || "-",
    reason: item.reason,
    statuss: item.status,
    canReview: item.supervisor_id === supervisorId && item.status === "pending",
    leave_id: item.leave_id,
    updated_at: item.updated_at?.split("T")[0] ?? "",
  }));

  return (
    <div className="h-screen flex flex-col overflow-hidden -ml-2">
      <div className="flex-1 overflow-auto hide-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div>Loading...</div>
          </div>
        ) : (
          <LeaveBasicTable
            tableHeader={LEAVE_REQUESTS_HEADER_DATA}
            tableData={currentItems as any}
            handleLeaveReviewAction={handleHiraReviewAction}
            handleClickViewAction={handleClickViewAction}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            showAddButton={false}
          />
        )}
      </div>

      {isFormOpen && selectedLeave && (
        <LeaveReviewForm
          isOpen={isFormOpen}
          leaveId={selectedLeave.leave_id.toString()}
          onClose={() => setIsFormOpen(false)}
          mode={formMode}
        />
      )}
    </div>
  );
};

export default LeaveApprovals;
