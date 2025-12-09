import React, { useEffect, useState } from "react";
import { CalendarDays, Edit, Trash2, Plus } from "lucide-react";
import AddHolidayModal from "../LeaveManagement/AddHolidayModal";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import BulkHolidayModal from "../LeaveManagement/BulkHolidayModal";
import NewAddHolidayModal from "../LeaveManagement/NewAddHolidayModal";

interface Holiday {
  holiday_id: number;
  holiday_name: string;
  holiday_type: string;
  holiday_date: string;
  status: string;
}

const LeavePublicHolidays: React.FC = () => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);
  const fetchHolidays = async () => {
    try {
      const res = await api.get("/api/holidays/all/");

      const mapped = (res.data || []).map((item: any) => ({
        holiday_id: item.public_holiday_id,
        holiday_name: item.holiday_name,
        holiday_type: item.holiday_type,
        holiday_date: item.holiday_date,
        status: item.status,
      }));

      setHolidays(mapped);
    } catch (err) {
      console.log("HOLIDAY LOAD ERROR:", err);
      toast.error("Failed to load holidays");
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const deleteHoliday = async (public_holiday_id: number) => {
    try {
      if (!public_holiday_id) {
        toast.error("Invalid Holiday ID!");
        return;
      }

      await api.delete(`/api/holidays/${public_holiday_id}`);
      toast.success("Holiday deleted");
      fetchHolidays();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setEditHoliday(holiday);
    setOpenModal(true);
  };
  const handleSave = async (data: any) => {
    try {
      console.log("SAVE DATA:", data);

      if (!data.holiday_id) {
        toast.error("Cannot update. Holiday ID missing!");
        return;
      }

      const payload = {
        holiday_name: data.holiday_name,
        holiday_type: data.holiday_type,
        holiday_date: data.holiday_date,
        status: data.status
      };

      await api.put(`/api/holidays/${data.holiday_id}`, payload);

      toast.success("Holiday Updated");
      setOpenModal(false);
      setEditHoliday(null);
      fetchHolidays();

    } catch (err) {
      console.log("SAVE ERROR:", err);
      toast.error("Update failed");
    }
  };



  return (
    <div className="bg-white rounded-xl shadow p-5">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarDays className="text-indigo-600" size={22} />
          Public Holidays
          <span className="text-gray-600 text-sm">({holidays.length})</span>
        </h2>

        {/* DISABLED ADD BUTTON */}
        <button
          onClick={() => setOpenModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Holiday
        </button>

      </div>

      {/* TABLE */}
      <div className="border border-blue-400 rounded-xl overflow-hidden">
        <div className="max-h-[55vh] overflow-y-auto overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
              <tr className="text-gray-700 text-sm">
                <th className="py-3 px-4 text-left w-[30%]">Holiday Name</th>
                <th className="py-3 px-4 text-left w-[20%]">Date</th>
                <th className="py-3 px-4 text-left w-[20%]">Day</th>
                <th className="py-3 px-4 text-left w-[15%]">Status</th>
                <th className="py-3 px-4 text-center w-[15%]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {holidays.map((holiday) => {
                const dateObj = new Date(holiday.holiday_date);

                return (
                  <tr key={holiday.holiday_id} className="bg-white hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{holiday.holiday_name}</td>

                    <td className="py-3 px-4 border-b text-gray-600">
                      {dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4 border-b text-gray-600">
                      {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                    </td>

                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${holiday.status?.toLowerCase() === "public"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {holiday.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 border-b">
                      <div className="flex justify-center gap-6">
                        <button
                          onClick={() => handleEdit(holiday)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => deleteHoliday(holiday.holiday_id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {holidays.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No holidays found
            </div>
          )}
        </div>
      </div>
      <AddHolidayModal
        open={openModal}
        editData={editHoliday}
        onClose={() => {
          setOpenModal(false);
          setEditHoliday(null);
        }}
        onSave={handleSave}
      />
      <NewAddHolidayModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={(added) => setHolidays(prev => [...prev, ...added])}
        onBulk={() => setOpenBulkModal(true)}
      />
      <BulkHolidayModal
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
      />
    </div>
  );
};

export default LeavePublicHolidays;