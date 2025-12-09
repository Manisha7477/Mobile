import React, { useEffect, useState } from "react";
import MocTopHeader from "../moc/MocTopHeader";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import MocClosurePreview from "./MocClosurePreview";
 
interface MocRequestCreationProps {
  onCancel?: () => void;
}
 
const RequestClosure: React.FC<MocRequestCreationProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState<any>({
    moc_request_id: "",
    moc_request_no: "",
    title: "",
    date: "",
    comments: "",
    station_name: "",
    approver_name: "",
    impact_of_modification: "",
    job_start_date: "",
    job_completion_date: "",
    closure_comments: "",
    justification: "",
    objectives: "",
    attachments: "",
    status: "Closed", // ✅ Default Closed
  });
 
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { moc_request_no } = useParams<{ moc_request_no: string }>();
 
  // ✅ Fetch moc_request_no + title dynamically
  useEffect(() => {
    const fetchMocData = async () => {
      if (!moc_request_no) return;
 
      try {
        setLoading(true);
        const res = await api.get(
          `/api/MOC/GetMocRequest?moc_request_no=${moc_request_no}`
        );
 
        if (res?.status === 200 && res?.data) {
          setFormData((prev: any) => ({
            ...prev,
            moc_request_id: res.data.moc_request_id || "",
            moc_request_no: res.data.moc_request_no || "",
            title: res.data.title || "",
          }));
        } else {
          toast.warning("No MoC data found!", { autoClose: 1500 });
        }
      } catch (error) {
        console.error("❌ Error fetching MoC:", error);
        toast.error("Failed to load MoC info", { autoClose: 1500 });
      } finally {
        setLoading(false);
      }
    };
    fetchMocData();
  }, [moc_request_no]);
 
  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
 
  // ✅ Validate required fields
  const validateRequired = () => {
    const required: Record<string, string> = {
      date: "Date",
      station_name: "MoC Initiator Department",
      approver_name: "Executing Department",
      job_start_date: "Job Start Date",
      job_completion_date: "Job Completion Date",
      closure_comments: "All HIRA Recommendations Closed and Closure",
    };
    for (const key of Object.keys(required)) {
      const v = (formData as any)[key];
      if (!v || String(v).trim() === "") {
        toast.error(`Please fill: ${required[key]}`, { autoClose: 1500 });
        return false;
      }
    }
    return true;
  };
 
  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate("/station-operations/moc");
  };
 
  const handlePrintPreview = () => setShowPreview(true);
 
  // ✅ Submit closure in one call (no update API)
  const handleSubmitClosure = async () => {
    if (!validateRequired()) return;
 
    try {
      const payload = {
        moc_request_id: formData.moc_request_id,
        moc_request_no: formData.moc_request_no,
        title_of_moc: formData.title,
        brief_description: formData.comments || "",
        moc_initiator_dept: formData.station_name || "",
        executing_dept: formData.approver_name || "",
        moc_execution_details: formData.impact_of_modification || "",
        hira_recommendation_status: formData.closure_comments || "",
        revised_operating_procedure: formData.justification || "",
        training_completed: formData.objectives || "",
        relevant_manuals: formData.attachments || "",
        comments_initiator: formData.comments || "",
        status: "Closed", // ✅ Status sent as Closed directly
        date: formData.date || new Date().toISOString().split("T")[0],
        job_start_date:
          formData.job_start_date || new Date().toISOString().split("T")[0],
        job_completion_date:
          formData.job_completion_date ||
          new Date().toISOString().split("T")[0],
      };
 
      console.log("📤 Submitting Closure Payload:", payload);
 
      const res = await api.post("/moc_closures/", payload);
 
      if (res.status === 200 || res.status === 201) {
        toast.success("✅ MoC Closure submitted successfully!", {
          autoClose: 1500,
        });
 
        // ✅ Save locally for dashboard auto-refresh
        localStorage.setItem(
          "MOC_UPDATED_STATUS",
          JSON.stringify({
            moc_request_no: formData.moc_request_no,
            status: "Closed",
          })
        );
 
        navigate("/station-operations/moc");
      } else {
        toast.error("Failed to submit closure", { autoClose: 1500 });
      }
    } catch (err: any) {
      console.error("❌ Submit Error:", err?.response?.data || err);
      toast.error("Something went wrong while submitting closure", {
        autoClose: 1800,
      });
    }
  };
 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-sm">Loading closure form...</p>
      </div>
    );
  }
 
  return (
    <>
      <div className="p-1 rounded-md mb-2">
        <MocTopHeader
          title={formData?.moc_request_no || "Loading..."}
          subTitle="MoC Closure Request"
        />
 
        <div className="mt-3 min-h-screen">
          <div
            className="mx-auto bg-white border-t rounded-lg flex flex-col"
            style={{
              height: "calc(93vh - 120px)",
              boxShadow:
                "0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)",
            }}
          >
            {/* Form Body */}
            <div className="flex-1 overflow-y-auto px-4 mt-3 border-b">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
 
              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Title of the MoC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
 
              {/* Request No + Date */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    MoC Request No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.moc_request_no}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
 
              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Brief Description
                </label>
                <textarea
                  name="brief_description"
                  value={formData.brief_description || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
 
              {/* Departments */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    MoC Initiator Department{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="station_name"
                    value={formData.station_name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Executing Department{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="approver_name"
                    value={formData.approver_name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
 
              {/* Execution Details */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  MoC Execution Details
                </label>
                <textarea
                  name="impact_of_modification"
                  value={formData.impact_of_modification || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
 
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="job_start_date"
                    value={formData.job_start_date || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Completion Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="job_completion_date"
                    value={formData.job_completion_date || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
 
              {/* Closure Section */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    All HIRA Recommendation Closed and Closure{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="closure_comments"
                    value={formData.closure_comments || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Revised operating procedure prepared{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="justification"
                    value={formData.justification || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Training of concern person completed{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="objectives"
                    value={formData.objectives || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Relevant Manual/P&ID/Other documents{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="attachments"
                    value={formData.attachments || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
 
              {/* Comments */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Comments (Initiator)
                </label>
                <textarea
                  name="comments"
                  value={formData.comments || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
 
            {/* Footer Buttons */}
            <div className="p-2 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintPreview}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                🖨 Print Preview
              </button>
              <button
                onClick={handleSubmitClosure}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                ✅ Submit Closure
              </button>
            </div>
          </div>
        </div>
      </div>
 
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white w-[95%] max-w-5xl rounded-lg shadow-lg border border-gray-300 relative">
            <MocClosurePreview
              data={formData}
              onBack={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
 
export default RequestClosure;