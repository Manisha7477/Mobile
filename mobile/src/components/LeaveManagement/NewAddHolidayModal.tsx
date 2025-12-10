import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
 
interface HolidayRow {
  name: string;
  holidayType: string;
  date: string;
}
 
interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (holidays: HolidayRow[]) => void;
  onBulk: () => void;
}
 
const NewAddHolidayModal: React.FC<Props> = ({ open, onClose, onAdd, onBulk }) => {
  const [rows, setRows] = useState<HolidayRow[]>([
    { name: "", holidayType: "", date: "" }
  ]);
 
  if (!open) return null;
 
  // Reset form rows
  const resetForm = () => {
    setRows([{ name: "", holidayType: "", date: "" }]);
  };
 
  // Add a row
  const addRow = () => {
    setRows([...rows, { name: "", holidayType: "", date: "" }]);
  };
 
  // Update a row field
  const handleChange = (index: number, field: keyof HolidayRow, value: string) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };
 
  // Delete a row
  const removeRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };
 
  // --------------------------
  // SAVE → API HIT (WORKING)
  // --------------------------
  const saveHolidays = async () => {
    try {
      const payloads = rows.map((h) => ({
        holiday_name: h.name,
        holiday_type: h.holidayType,
        holiday_date: h.date,
       status: "Active"
      }));
 
      const responses = await Promise.all(
        payloads.map((p) =>
          api.post("/api/holidays/", p)
        )
      );
 
      const added = rows.map((h, idx) => ({
        id: responses[idx].data.id,
        name: h.name,
        holidayType: h.holidayType,
        date: h.date
      }));
 
      onAdd(added); // send back to table
      resetForm();
      onClose();
 
      toast.success("Holiday added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add holiday");
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[860px] rounded-xl p-6 shadow-xl">
 
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Add Holiday</h2>
 
          {/* FIX: Close button should NOT call API */}
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            <X className="text-gray-500 hover:text-gray-700" size={22} />
          </button>
        </div>
 
        <p className="text-gray-500 text-sm mb-5">
          Add new public holidays for the company
        </p>
 
        {/* Holiday Rows */}
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-3">
 
            {/* Holiday Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Holiday Name</label>
              <input
                type="text"
                placeholder="e.g., Holi"
                value={row.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              />
            </div>
 
            {/* Holiday Type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Holiday Type</label>
              <select
                value={row.holidayType}
                onChange={(e) => handleChange(index, "holidayType", e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Holiday Type</option>
                <option value="PUBLIC">Public Holiday</option>
                <option value="RESTRICTED">Restricted Holiday</option>
              </select>
            </div>
 
            {/* Date + Delete */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Date</label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm flex-1"
                />
 
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(index)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-md"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                )}
              </div>
            </div>
 
          </div>
        ))}
 
        {/* Add Row */}
        <button
          onClick={addRow}
          className="text-indigo-600 hover:underline text-sm font-medium mb-4"
        >
          + Add another holiday
        </button>
 
        {/* Bulk Insertion */}
        <button
          onClick={onBulk}
          className="block text-indigo-600 hover:underline text-sm font-medium"
        >
          Bulk Insertion
        </button>
 
        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-5 py-2 text-gray-600 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
 
          {/* FIX: This button NOW hits API */}
          <button
            onClick={saveHolidays}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            Add Holiday
          </button>
        </div>
 
      </div>
    </div>
  );
};
 
export default NewAddHolidayModal;