import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/axiosInstance";

interface LeaveType {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
}

interface ApplyLeaveFormProps {
  onClose?: () => void;
}

type DaySelection = "full" | "half";

function datesBetween(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const days: string[] = [];
  for (
    let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    d <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    d.setDate(d.getDate() + 1)
  ) {
    // format YYYY-MM-DD
    const iso = new Date(d).toISOString().slice(0, 10);
    days.push(iso);
  }
  return days;
}

export default function ApplyLeaveForm({ onClose }: ApplyLeaveFormProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: "",
    numberOfDays: 1,
    fromDate: "",
    toDate: "",
    reason: "",
    address: "",
    phoneNumber: "",
    remarks: "",
  });

  // per-date selection map: date (YYYY-MM-DD) => "full" | "half"
  const [perDaySelection, setPerDaySelection] = useState<Record<string, DaySelection>>({});
  const [halfDayAllowed, setHalfDayAllowed] = useState<boolean | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const storedUser = localStorage.getItem('userData');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser.userId;
  const firstName = parsedUser.firstName;
  const lastName = parsedUser.lastName;
  const supervisorName = parsedUser.supervisorName;
  const supervisorId = parsedUser.supervisorId;

  // fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoadingLeaveTypes(true);
        const res = await api.get("/api/leave/type/");
        setLeaveTypes(res.data || []);
      } catch (e) {
        toast.error("Failed to load leave types");
      } finally {
        setLoadingLeaveTypes(false);
      }
    };
    fetchLeaveTypes();
  }, []);

  // update list of dates whenever from/to change
  const dateList = useMemo(() => {
    if (formData.fromDate && formData.toDate) {
      try {
        const list = datesBetween(formData.fromDate, formData.toDate);
        return list;
      } catch {
        return [];
      }
    }
    return [];
  }, [formData.fromDate, formData.toDate]);

  // initialize or sync perDaySelection when dateList changes
  useEffect(() => {
    if (dateList.length === 0) {
      setPerDaySelection({});
      setFormData((p) => ({ ...p, numberOfDays: 1 }));
      return;
    }

    setPerDaySelection((prev) => {
      const next: Record<string, DaySelection> = {};
      dateList.forEach((d) => {
        next[d] = prev[d] ?? "full"; // default full if not set
      });
      return next;
    });

    // auto-calc numberOfDays as number of full days + 0.5 * half-days
    const fullCount = Object.values(perDaySelection).filter((v) => v === "full").length;
    const halfCount = Object.values(perDaySelection).filter((v) => v === "half").length;
    // If perDaySelection not yet updated (first render), fallback to dateList length
    const fallbackDays = dateList.length;
    const calculated =
      Object.keys(perDaySelection).length > 0
        ? fullCount + halfCount * 0.5
        : fallbackDays;
    setFormData((p) => ({ ...p, numberOfDays: Math.max(1, calculated) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateList]);

  // recalc numberOfDays any time perDaySelection changes
  useEffect(() => {
    if (!dateList.length) return;
    const full = Object.values(perDaySelection).filter((v) => v === "full").length;
    const half = Object.values(perDaySelection).filter((v) => v === "half").length;
    const calculated = full + half * 0.5;
    setFormData((p) => ({ ...p, numberOfDays: Math.max(1, calculated) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perDaySelection]);

  // AUTO VALIDATE LEAVE WHEN USER ENTERS DATA
  useEffect(() => {
    const { leaveType, fromDate, toDate } = formData;

    if (!leaveType || !fromDate || !toDate) return;

    const half = Object.values(perDaySelection).filter((v) => v === "half").length;

    const payload = {
      user_id: userId,
      leave_type: leaveType,
      from_date: fromDate,
      to_date: toDate,
      half_day_count: half,
      has_med_cert: !!uploadedFile,
    };

    const validate = async () => {
      try {
        const res = await api.post("/api/leave/validate", payload);

        if (res.data) {
          setHalfDayAllowed(res.data.half_day_allowed);

          if (res.data.number_of_days) {
            setFormData((prev) => ({
              ...prev,
              numberOfDays: res.data.number_of_days,
            }));
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Leave validation failed");
        setFormData((prev) => ({ ...prev, numberOfDays: 0 }));
        setHalfDayAllowed(null);
      }
    };

    validate();
  }, [
    formData.leaveType,
    formData.fromDate,
    formData.toDate,
    perDaySelection,
    uploadedFile,
  ]);

  function isWeekend(dateStr: string) {
    const d = new Date(dateStr);
    const day = d.getDay(); // 0 = Sun, 6 = Sat
    return day === 0 || day === 6;
  }


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfDays" ? Number(value) : value,
    }));
  };

  const handlePerDayChange = (date: string, sel: DaySelection) => {
    setPerDaySelection((prev) => ({ ...prev, [date]: sel }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setUploadedFile(f);
    else setUploadedFile(null);
  };

  const halfDayCount = Object.values(perDaySelection).filter((v) => v === "half").length;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.leaveType || !formData.fromDate || !formData.toDate) {
  //     toast.error("Please fill required fields: Leave type and both dates.");
  //     return;
  //   }

  //   // Build payload required by API
  //   const payload = {
  //     user_id: 1,
  //     leave_type_code: formData.leaveType,
  //     from_date: formData.fromDate,
  //     to_date: formData.toDate,
  //     half_day_count: halfDayCount,
  //     has_med_cert: !!uploadedFile,
  //   };

  //   try {
  //     await api.post("/leave/validate", payload);

  //     toast.success("Leave application submitted successfully!");
  //     onClose?.();
  //   } catch (err) {
  //     toast.error("Failed to submit leave application");
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.leaveType || !formData.fromDate || !formData.toDate) {
        toast.error("Please fill required fields.");
        return;
      }

      const halfDayCount = Object.values(perDaySelection).filter((v) => v === "half").length;

      // ------------------------------
      // 1️⃣ FIRST API CALL: /leave/apply
      // ------------------------------
      const applyPayload = {
        user_id: userId,
        supervisor_id: supervisorId,
        supervisor_name: supervisorName,
        user_name: firstName,
        supervisor_remarks: "",
        leave_type: formData.leaveType,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        number_of_days: formData.numberOfDays,
        reason: formData.reason,
        // document_path: uploadedFile ? uploadedFile.name : "",
        contact_address: formData.address,
        phone_number: formData.phoneNumber,
        reversal_from_date: formData.fromDate,
        reversal_to_date: formData.toDate,
        reversal_remarks: formData.remarks,
        status: "Pending",
      };

      const formDataToSend = new FormData();

      Object.entries(applyPayload).forEach(([key, value]) => {
        formDataToSend.append(key, value as any);
      });

      if (uploadedFile) {
        formDataToSend.append("document", uploadedFile);
      } else {
        formDataToSend.append("document", "");
      }

      const res1 = await api.post("/api/leave/apply", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const leaveAppId = res1?.data?.leave_id; // backend must return id
      if (!leaveAppId) {
        toast.error("Leave application failed! No ID returned.");
        return;
      }

      for (const dt of dateList) {
        const daySel = perDaySelection[dt]; // "full" | "half"

        const addPayload = {
          leave_application_id: leaveAppId,
          leave_date: dt,
          day_type: daySel === "full" ? "full" : "half",
          half_session: daySel === "half" ? "AM" : "", // or "PM" if you ask user
        };

        await api.post("/api/leave/add", addPayload);
      }

      toast.success("Leave applied successfully!");
      onClose?.();

    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Leave submission failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-[100vh] relative max-h-[95vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 ml-3 border-b">
          <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="space-y-3">
            {/* Type of Leave and Number of Days */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Leave*</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select leave type</option>
                  {leaveTypes
                    .filter((t) => t.is_active)
                    .map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                <input
                  type="number"
                  name="numberOfDays"
                  value={formData.numberOfDays}
                  readOnly
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100"
                />
                <div className="text-xs text-gray-500 mt-1">Half days: {halfDayCount}</div>
              </div>
            </div>

            {/* From and To */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date*</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date*</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Per-day full/half selectors (renders when both dates selected) */}
            {dateList.map((d) => {
              const weekend = isWeekend(d);

              // Half Day visible only if:
              // - It's a weekday AND
              // - half_day_allowed is true OR null
              const showHalfOption =
                !weekend && (halfDayAllowed === true || halfDayAllowed === null);

              return (
                <div key={d} className="flex items-center justify-between">
                  <div className="text-sm">{d}</div>

                  <div className="flex items-center gap-4">

                    {/* FULL DAY → Always visible */}
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name={`day-${d}`}
                        checked={perDaySelection[d] === "full"}
                        onChange={() => handlePerDayChange(d, "full")}
                        className="mr-1"
                      />
                      Full Day
                    </label>

                    {/* HALF DAY → Only weekdays & allowed */}
                    {showHalfOption && (
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          name={`day-${d}`}
                          checked={perDaySelection[d] === "half"}
                          onChange={() => handlePerDayChange(d, "half")}
                          className="mr-1"
                        />
                        Half Day
                      </label>
                    )}

                    {/* Weekend info (optional) */}
                    {weekend && (
                      <span className="text-xs text-gray-500">
                        Weekend — Half Day not allowed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Reason + Upload (side-by-side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-y"
                  placeholder="Enter reason for leave"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload document (optional)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {uploadedFile ? uploadedFile.name : "No file selected"}
                </div>
              </div>
            </div>

            {/* Contact Address & Telephone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address & Telephone (While on leave)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Add address"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-y"
                placeholder="Any remarks"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
