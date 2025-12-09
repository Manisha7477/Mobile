import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
 
interface Props {
  open: boolean;
  onClose: () => void;
  editData?: any | null;
  onSave: (data: any) => void;
}
 
const AddHolidayModal: React.FC<Props> = ({
  open,
  onClose,
  editData,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Public");
  const [date, setDate] = useState("");
 
  useEffect(() => {
    if (editData) {
      setName(editData.holiday_name);
      setType(editData.holiday_type);
      setDate(editData.holiday_date);
    } else {
      setName("");
      setType("Public");
      setDate("");
    }
  }, [editData]);
 
  if (!open) return null;
 
  const handleSubmit = () => {
    if (!name || !date) return;
 
    onSave({
      holiday_id: editData?.holiday_id,
      holiday_name: name,
      holiday_type: type,
      holiday_date: date,
      status: type,
    });
  };
 
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[650px] rounded-xl p-6 shadow-xl">
       
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Edit Holiday</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
 
        <p className="text-gray-500 text-sm mb-5">Update holiday details</p>
 
        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
 
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Holiday Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
 
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Holiday Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="Public">Public</option>
              <option value="Restricted">Restricted</option>
            </select>
          </div>
 
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
 
        </div>
 
        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 bg-gray-100 rounded-md">
            Cancel
          </button>
 
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            Update Holiday
          </button>
        </div>
 
      </div>
    </div>
  );
};
 
export default AddHolidayModal;