import React, { useEffect, useState } from "react";
import { LEAVE_ALLOCATION_HEADER_DATA, LEAVE_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { MocFilters } from "../moc/MocDropdown";
import LeaveBasicTable from "../tables/LeaveBasicTable";
import { toast } from "react-toastify";
interface LeaveSummary {
  leave_type_id: number;
  leave_type_name: string;
  encashable: number;
  non_encashable: number;
  allocated: number;
  applied: number;
  balance: number;
}


const LeaveAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LeaveSummary[]>([]);
  const storedUser = localStorage.getItem("userData");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.userId;
  const navigate = useNavigate();

  ;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(`api/leave/summary/${userId}`);
        setData(res.data.leaves);
      } catch (err) {
        toast.error("Failed to fetch leave summary");
      }
    };

    fetchSummary();
  }, []);

const allowedLeaveTypes = [
  "Casual Leave",
  "Earned Leave",
  "Half Pay Leave",
  "Extraordinary Leave",
  "Public Holidays"
];

const filteredRows = data.filter((item) =>
  allowedLeaveTypes.includes(item.leave_type_name)
);

  return (
    <>
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
                  tableHeader={LEAVE_ALLOCATION_HEADER_DATA}
                  tableData={filteredRows.map((item, index) => ({
                    slNo: index + 1,
                    ...item
                  }))}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  showAddButton={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  )

};

export default LeaveAnalytics;
