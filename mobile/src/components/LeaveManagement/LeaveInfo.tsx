import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
 
interface LeaveSummary {
  leave_type_id: number;
  leave_type_name: string;
  encashable: number;
  non_encashable: number;
  allocated: number;
  applied: number;
  balance: number;
}
 
interface LeaveInfoProps {
  onClose: () => void;  
}
 
const LeaveInfo: React.FC<LeaveInfoProps> = ({ onClose }) => {
  const [data, setData] = useState<LeaveSummary[]>([]);
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.userId;
  const navigate = useNavigate();
 
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
    ];
 
    const filteredRows = data.filter((item) =>
        allowedLeaveTypes.includes(item.leave_type_name)
    );
  return (
    // 🔥 DARK OVERLAY
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
     
      {/* 🔥 CENTER MODAL BOX */}
      <div className="bg-white w-11/12 max-w-4xl rounded-lg shadow-lg p-5 relative max-h-[80vh] overflow-y-auto">
 
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>
 
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Leave Information
        </h2>
 
        {/* TABLE */}
        <div className="w-full overflow-x-auto mt-2">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-900 font-bold">
                <th className="px-4 py-2 border-r border-gray-300">Leave Type</th>
                <th className="px-4 py-2">Leave Availed</th>
                <th className="px-4 py-2">Encashable</th>
                <th className="px-4 py-2">Non Encashable</th>
                <th className="px-4 py-2">Leave Balance</th>
                <th className="px-4 py-2">Action</th>
 
              </tr>
            </thead>
 
            <tbody>
               {filteredRows.map((item) => (
                <tr key={item.leave_type_id} className="border-t">
                  <td className="px-4 py-2 font-semibold border-r border-gray-300">
                    {item.leave_type_name}
                  </td>
                  <td className="px-4 py-2">{item.applied}</td>
                  <td className="px-4 py-2">{item.encashable}</td>
                  <td className="px-4 py-2">{item.non_encashable}</td>
                  <td className="px-4 py-2">{item.balance}</td>
                  <td className="px-4 py-2">
                    {item.encashable > 0 ? (
                    <button
                        onClick={() => navigate("/hr-admin/claim-management")}
                        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                        Encash Now
                    </button>
                    ) : (
                    <button
                        disabled
                        className="bg-gray-200 text-gray-500 px-4 py-1 rounded-md cursor-not-allowed"
                    >
                        Non Encashable
                    </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
      </div>
    </div>
  );
};
 
export default LeaveInfo;