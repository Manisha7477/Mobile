import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/axiosInstance";

type DaySelection = "full" | "half";

interface LeaveReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  leaveId?: string;
  mode?: "view" | "review";
}

interface FormData {
  leaveType: string;
  numberOfDays: number;
  fromDate: string;
  toDate: string;
  reason: string;
  address: string;
  phoneNumber: string;
  reversal_remarks: string;
  supervisor_remarks: string;
}

function datesBetween(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const days: string[] = [];
  for (
    let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    d.setDate(d.getDate() + 1)
  ) {
    days.push(new Date(d).toISOString().slice(0, 10));
  }
  return days;
}

export default function LeaveReviewForm({ isOpen, onClose, leaveId, mode }: LeaveReviewFormProps) {
  const [formData, setFormData] = useState<FormData>({
    leaveType: "",
    numberOfDays: 1,
    fromDate: "",
    toDate: "",
    reason: "",
    address: "",
    phoneNumber: "",
    reversal_remarks: "",
    supervisor_remarks: "",
  });
  const [perDaySelection, setPerDaySelection] = useState<Record<string, DaySelection>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [supervisorInfo, setSupervisorInfo] = useState<{ id: number; name: string }>({ id: 0, name: "" });

  const isWeekend = (date: string) => {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  // ---------------- Fetch leave details ----------------
  useEffect(() => {
    const fetchDetails = async () => {
      if (!leaveId) return;
      try {
        const res = await api.get(`/api/leave/details/${leaveId}`);
        const record = Array.isArray(res.data) ? res.data[0] : null;
        if (!record) return toast.error("Invalid leave format");

        const header = record.leave_header;
        const leaveDays = record.leave_days || [];

        // Set supervisor info from API
        setSupervisorInfo({ id: header.supervisor_id, name: header.supervisor_name });

        // Prefill main form
        setFormData({
          leaveType: header.leave_type || "",
          fromDate: header.from_date || "",
          toDate: header.to_date || "",
          numberOfDays: header.number_of_days || 1,
          reason: header.reason || "",
          address: header.contact_address || "",
          phoneNumber: header.phone_number || "",
          reversal_remarks: header.reversal_remarks || "",
          supervisor_remarks: header.supervisor_remarks || "",
        });

        // Prefill day-wise selection
        const daySelection: Record<string, DaySelection> = {};
        leaveDays.forEach((d: any) => {
          daySelection[d.leave_date] = d.day_type === "half" ? "half" : "full";
        });
        setPerDaySelection(daySelection);

        // Set uploaded document (read-only)
        if (header.document_path) {
          setUploadedFile(new File([], header.document_path)); // placeholder for display
        }
      } catch (err) {
        console.error("Failed to load details", err);
        toast.error("Failed to load leave details");
      }
    };
    fetchDetails();
  }, [leaveId]);

  // ---------------- Generate date list ----------------
  const dateList = useMemo(() => {
    if (formData.fromDate && formData.toDate) return datesBetween(formData.fromDate, formData.toDate);
    return [];
  }, [formData.fromDate, formData.toDate]);

  // ---------------- Initialize per-day selection ----------------
  useEffect(() => {
    if (!dateList.length) return;
    setPerDaySelection((prev) => {
      const next: Record<string, DaySelection> = {};
      dateList.forEach((d) => {
        next[d] = prev[d] ?? "full";
      });
      return next;
    });
  }, [dateList]);

  // ---------------- Calculate number of days ----------------
  const halfDayCount = Object.values(perDaySelection).filter((v) => v === "half").length;
  useEffect(() => {
    if (!dateList.length) return;
    const full = Object.values(perDaySelection).filter((v) => v === "full").length;
    const half = halfDayCount;
    setFormData((p) => ({ ...p, numberOfDays: Math.max(1, full + half * 0.5) }));
  }, [perDaySelection, halfDayCount, dateList.length]);

  // ---------------- Handlers ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePerDayChange = (date: string, value: DaySelection) => setPerDaySelection((prev) => ({ ...prev, [date]: value }));
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => setUploadedFile(e.target.files?.[0] || null);

  const handleSupervisorUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveId) return toast.error("Leave ID missing!");
    try {
      const payload = {
        p_leave_id: Number(leaveId),
        p_supervisor_id: supervisorInfo.id,
        p_supervisor_name: supervisorInfo.name,
        p_status: "Approved",
        p_reversal_from_date: formData.fromDate,
        p_reversal_to_date: formData.toDate,
        reversal_remarks: formData.reversal_remarks || "",
      };
      await api.put("/api/leave/update-leave-application-supervisor", payload);
      toast.success("Leave updated by supervisor successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Supervisor update failed");
    }
  };

  if (!isOpen) return null;

  // ---------------- Render ----------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSupervisorUpdate} className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 ml-3 border-b">
          <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {/* Leave Type + Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Type of Leave*</label>
              <input type="text" value={formData.leaveType} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Number of Days</label>
              <input type="number" value={formData.numberOfDays} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100" />
              <div className="text-xs text-gray-500 mt-1">Half days: {halfDayCount}</div>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">From Date*</label>
              <input type="date" value={formData.fromDate} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date*</label>
              <input type="date" value={formData.toDate} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100" />
            </div>
          </div>

          {/* Per day selection */}
          {dateList.map((d) => (
            <div key={d} className="flex items-center justify-between">
              <div className="text-sm">{d}</div>
              <div className="flex items-center gap-4">
                <label className="text-sm">
                  <input type="radio" checked={perDaySelection[d] === "full"} readOnly className="mr-1" />
                  Full Day
                </label>
                {!isWeekend(d) && (
                  <label className="text-sm">
                    <input type="radio" checked={perDaySelection[d] === "half"} readOnly className="mr-1" />
                    Half Day
                  </label>
                )}
                {isWeekend(d) && <span className="text-xs text-gray-500">Weekend — Half not allowed</span>}
              </div>
            </div>
          ))}

          {/* Reason + Upload */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Reason</label>
              <textarea value={formData.reason} readOnly rows={3} className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium">Uploaded Document</label>
              {uploadedFile ? (
                <a
                  href={`${process.env.REACT_APP_API_BASE_URL}/uploads/${uploadedFile.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {uploadedFile.name}
                </a>
              ) : (
                <div className="text-xs text-gray-500 mt-1">No document uploaded</div>
              )}
            </div>
          </div>
          {/* Address + Phone */}
          <div>
            <label className="block text-sm font-medium">Contact Address & Telephone</label>
            <input type="text" value={formData.address} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 mb-2" />
            <input type="tel" value={formData.phoneNumber} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100" />
          </div>

          {/* Reversal Remarks (editable by supervisor) */}
          <div>
            <label className="block text-sm font-medium">Remarks</label>
            <textarea
              name="reversal_remarks"
              value={formData.reversal_remarks}
              onChange={handleChange}
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        {mode === "review" && (
          <div className="flex justify-end gap-3 p-3 border-t bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Approved
            </button>
          </div>
        )}


      </form>
    </div>
  );
}
