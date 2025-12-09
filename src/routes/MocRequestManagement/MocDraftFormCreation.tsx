import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import MoCRequestForm from "./MocRequestForm";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
 
interface MocRequestCreationProps {
  onCancel?: () => void;
}
 
interface MocFormData {
  station_name: string;
  title: string;
  date: string;
  priority: string;
  modification_type: string;
  time_limit: string;
  shutdown_required: string;
  present_system: string;
  proposed_change: string;
  justification: string;
  objectives: string;
  other_units_impacted: string;
  statutory_approval_required: string;
  statutory_approval_details: string;
  impact_of_modification: string;
  consequences_non_implementation: string;
  hse: boolean;
  efficiency: boolean;
  quality: boolean;
  reliability: boolean;
  other_aspects: string;
  objectives_achieved: string;
  attachments: string;
  comments: string;
  status: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  submission_date: string;
  moc_request_no?: string | null;
  moc_request_id?: number | null;
}
 
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="bg-white flex items-center justify-center sticky top-0 z-10">
    <div className="flex items-center w-full max-w-md">
      {/* Step 1 */}
      <div className="flex flex-col items-center mr-0.5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 1
              ? "bg-blue-700 text-white"
              : currentStep > 1
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          1
        </div>
        <span
          className={`text-sm mt-1 ${
            currentStep === 1
              ? "text-blue-700 font-semibold"
              : currentStep > 1
              ? "text-green-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          MOC Request Form
        </span>
      </div>
 
      <div
        className={`-ml-12 -mt-6 flex-1 h-1 ${
          currentStep > 1 ? "bg-green-600" : "bg-gray-300"
        }`}
      ></div>
 
      {/* Step 2 */}
      <div className="flex flex-col items-center -ml-5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 2
              ? "bg-blue-700 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          2
        </div>
        <span
          className={`text-sm mt-1 ${
            currentStep === 2 ? "text-blue-700 font-semibold" : "text-gray-600"
          }`}
        >
          HIRA Form
        </span>
      </div>
    </div>
  </div>
);
 
const MocDraftFormCreation: React.FC<MocRequestCreationProps> = ({ onCancel }) => {
  const { moc_request_no } = useParams<{ moc_request_no: string }>();
  const navigate = useNavigate();
 
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const username = parsedUser?.username;
 
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
 
  const [formData, setFormData] = useState<MocFormData>({
    station_name: "Devangonthi",
    title: "",
    date: "",
    priority: "",
    modification_type: "",
    time_limit: "",
    shutdown_required: "",
    present_system: "",
    proposed_change: "",
    justification: "",
    objectives: "",
    other_units_impacted: "",
    statutory_approval_required: "",
    statutory_approval_details: "",
    impact_of_modification: "",
    consequences_non_implementation: "",
    hse: false,
    efficiency: false,
    quality: false,
    reliability: false,
    other_aspects: "",
    objectives_achieved: "",
    attachments: "",
    comments: "",
    status: "Draft",
    is_active: true,
    created_by: username,
    updated_by: username,
    submission_date: new Date().toISOString().split("T")[0],
    moc_request_no: null,
    moc_request_id: null,
  });
 
  // ✅ Prefill if editing existing draft
  useEffect(() => {
    if (!moc_request_no) return;
    const fetchDraftData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/MOC/GetMocRequest", {
          params: { moc_request_no },
        });
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            moc_request_no,
          }));
        }
      } catch (err) {
        console.error("Error fetching draft data:", err);
        toast.error("Failed to load draft data");
      } finally {
        setLoading(false);
      }
    };
    fetchDraftData();
  }, [moc_request_no]);
 
  const handleFilesSelected = (selectedFiles: File[]) => {
    console.log("📂 Files selected:", selectedFiles);
    setFiles(selectedFiles);
  };
 
 
 
  const sanitizeMocPayload = (data: MocFormData) => {
  const toBool = (val: any) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
      const lower = val.toLowerCase();
      return lower === "yes" || lower === "true";
    }
    return false;
  };
 
  // ✅ handle time_limit
  let safeTimeLimit = data.time_limit;
  if (!safeTimeLimit || safeTimeLimit === "N/A") {
    safeTimeLimit = new Date().toISOString().split("T")[0];
  } else if (!isNaN(Number(safeTimeLimit))) {
    // If user typed a number of days like "10"
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(safeTimeLimit));
    safeTimeLimit = deadline.toISOString().split("T")[0];
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(safeTimeLimit)) {
    // Fallback for invalid formats
    safeTimeLimit = new Date().toISOString().split("T")[0];
  }
 
  return {
    ...data,
    shutdown_required: toBool(data.shutdown_required),
    statutory_approval_required: toBool(data.statutory_approval_required),
    objectives_achieved: toBool(data.objectives_achieved),
    time_limit: safeTimeLimit,
    submission_date: data.submission_date
      ? new Date(data.submission_date).toISOString()
      : new Date().toISOString(),
    status: data.status || "Draft",
    is_active: data.is_active ?? true,
    updated_by: data.updated_by || username || "Admin_1",
  };
};
 
 
 
  const uploadMocFiles = async (moc_request_id: number, moc_request_no: string) => {
  if (!files.length) {
    console.warn("⚠️ No files selected, skipping upload.");
    return;
  }
 
  const fileFormData = new FormData();
  files.forEach((file) => fileFormData.append("files", file));
 
  try {
    console.log("📤 Uploading files for", moc_request_no);
 
    const uploadResponse = await api.post(
      `/moc/files/upload?moc_request_id=${moc_request_id}&moc_request_no=${encodeURIComponent(
        moc_request_no
      )}`,
      fileFormData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
 
    if (uploadResponse.status === 200) {
      toast.success("Files uploaded successfully!", { autoClose: 1200 });
 
      // ✅ Update uploaded files state immediately after upload
      setUploadedFiles(uploadResponse.data || []);
      console.log("✅ Uploaded files saved to state:", uploadResponse.data);
    } else {
      toast.warning("Unexpected status from upload API", { autoClose: 1500 });
    }
  } catch (error) {
    console.error("❌ Error uploading files:", error);
    toast.error("Error uploading files", { autoClose: 1500 });
  }
};
 
 
  // 🧠 State for storing existing uploaded files
const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
 
useEffect(() => {
  if (!moc_request_no) return;
 
  const fetchDraftData = async () => {
    setLoading(true);
    try {
      console.log("📥 Fetching MoC draft for:", moc_request_no);
      const res = await api.get("/api/MOC/GetMocRequest", { params: { moc_request_no } });
 
      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          // ✅ Only fill fields that were empty, don't overwrite user input
          ...Object.fromEntries(
            Object.entries(res.data).filter(([key, value]) => prev[key as keyof MocFormData] === "" || prev[key as keyof MocFormData] == null)
          ),
          moc_request_no,
        }));
 
        const moc_request_id = res.data.moc_request_id;
        if (res.data.attachments && moc_request_id) {
          const fileRes = await api.get(`/moc/files/by-id/${moc_request_id}`);
          setUploadedFiles(fileRes.data || []);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching draft data:", err);
      toast.error("Failed to load draft data");
    } finally {
      setLoading(false);
    }
  };
 
  fetchDraftData();
}, [moc_request_no]);
 
 
 
const saveMocRequest = async (navigateNext: boolean = false) => {
  setLoading(true);
  try {
    // ✅ First sanitize the payload
    const sanitizedPayload = sanitizeMocPayload(formData);
 
    // ✅ Override status based on action
    sanitizedPayload.status = navigateNext ? "Pending HIRA Review" : "Draft";
 
    // ✅ Check if we are updating or creating new
    const isUpdate = !!(sanitizedPayload.moc_request_no && sanitizedPayload.moc_request_id);
    const url = isUpdate
      ? "/api/MOC/UpdateMocRequest"
      : "/api/MOC/CreateMocRequest";
    const method = isUpdate ? "put" : "post";
 
    console.log("💾 Saving MoC request via", method, url, sanitizedPayload);
 
    const res = await api({ method, url, data: sanitizedPayload });
    const apiResponse = res.data;
 
    // ✅ Always extract IDs from response
    const new_moc_request_id =
      apiResponse?.message?.data?.moc_request_id ||
      sanitizedPayload.moc_request_id;
 
    const new_moc_request_no =
      apiResponse?.message?.data?.moc_request_no ||
      sanitizedPayload.moc_request_no;
 
    console.log("✅ MoC Saved:", {
      new_moc_request_id,
      new_moc_request_no,
      isUpdate,
    });
 
    // ✅ Update state immediately with latest info
    setFormData((prev) => ({
      ...prev,
      moc_request_id: new_moc_request_id,
      moc_request_no: new_moc_request_no,
      status: sanitizedPayload.status,
    }));
 
    // ✅ Toast notification based on action
    toast.success(
      navigateNext
        ? "MoC moved to Pending HIRA Review!"
        : isUpdate
        ? "Draft updated successfully!"
        : "Draft created successfully!",
      { autoClose: 1200 }
    );
 
    // ✅ Upload files (only after we have ID)
    if (files.length > 0 && new_moc_request_id && new_moc_request_no) {
      await uploadMocFiles(new_moc_request_id, new_moc_request_no);
    }
 
    // ✅ If navigating to next step
    if (navigateNext && new_moc_request_no) {
      navigate("/station-operations/moc/next-request-form", {
        state: {
          step: 2,
          moc_request_no: new_moc_request_no,
          station: formData.station_name,
        },
      });
    }
  } catch (err) {
    console.error("❌ Save MoC failed:", err);
    toast.error("Failed to save MoC Request");
  } finally {
    setLoading(false);
  }
};
 
 
  const handleCancel = () =>
    onCancel ? onCancel() : navigate("/station-operations/moc");
 
  const handleBack = () => setCurrentStep(1);
 
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col h-full p-1">
        <div className="p-1 rounded-md mb-1">
          <MocTopHeader title="MoC New Request" />
        </div>
        <StepIndicator currentStep={currentStep} />
   
        <MoCRequestForm
  currentStep={currentStep}
  handleCancel={handleCancel}
  handleNext={() => saveMocRequest(true)}      // Save + navigate
  handleBack={handleBack}
  loading={loading}
  formData={formData}
  setFormData={setFormData}
  handleSaveDraft={() => saveMocRequest(false)} // Save only
  onFilesSelected={handleFilesSelected}
    uploadedFilesFromServer={uploadedFiles}
 
/>
 
      </div>
    </div>
  );
};
 
export default MocDraftFormCreation;
 
 