import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="bg-white flex items-center justify-center sticky top-0 z-10">
    <div className="flex items-center w-full max-w-md">
      {/* Step 1 */}
      <div className="flex flex-col items-center mr-0.5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep === 1
            ? "bg-blue-700 text-white"
            : currentStep > 1
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
            }`}
        >
          1
        </div>
        <span
          className={`text-sm mt-1 ${currentStep === 1
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
        className={`-ml-12 -mt-6 flex-1 h-1 ${currentStep > 1 ? "bg-green-600" : "bg-gray-300"
          }`}
      ></div>

      {/* Step 2 */}
      <div className="flex flex-col items-center -ml-5">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep === 2
            ? "bg-blue-700 text-white"
            : "bg-gray-300 text-gray-600"
            }`}
        >
          2
        </div>
        <span
          className={`text-sm mt-1 ${currentStep === 2
            ? "text-blue-700 font-semibold"
            : "text-gray-600"
            }`}
        >
          HIRA Form
        </span>
      </div>
    </div>
  </div>
);

const MocRequestCreation: React.FC<MocRequestCreationProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // ✅ For file storage
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const stationName = parsedUser?.stationName;
  const username = parsedUser?.username;
  console.log("userName", username);


  const [formData, setFormData] = useState<MocFormData>({
    station_name: stationName,
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
    status: "Pending HIRA Review",
    is_active: true,
    created_by: username,
    updated_by: username,
    submission_date: new Date().toISOString().slice(0, 10),
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();




  const uploadMocFiles = async (moc_request_id: number, moc_request_no: string) => {
    if (!files.length) {
      console.warn("⚠️ No files selected, skipping upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadResponse = await api.post(
        `http://122.166.153.170:8084/moc/files/upload?moc_request_id=${moc_request_id}&moc_request_no=${encodeURIComponent(moc_request_no)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Upload Response:", uploadResponse.data);
      if (uploadResponse.status === 200) {
        toast.success("Files uploaded successfully!", { autoClose: 1200 });
      } else {
        toast.warning("Unexpected status from upload API", { autoClose: 1500 });
      }
    } catch (error) {
      console.error("❌ Error uploading files:", error);
      toast.error("Error uploading files", { autoClose: 1500 });
    }
  };

  // ✅ Save Draft Logic
  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const draftPayload = {
        ...formData,
        status: "Draft", // ✅ mark as draft
        submission_date: new Date().toISOString().slice(0, 10),
      };

      console.log("Saving Draft Payload:", draftPayload);

      const response = await api.post("/api/MOC/CreateMocRequest", draftPayload);

      if ([200, 201].includes(response.status)) {
        const responseData = response.data?.message?.data;
        const moc_request_no = responseData?.moc_request_no;
        const moc_request_id = responseData?.moc_request_id;

        toast.success("Draft saved successfully!", { autoClose: 1200 });

        // ✅ Upload attached files if any
        if (moc_request_no && moc_request_id && files.length > 0) {
          await uploadMocFiles(moc_request_id, moc_request_no);
        }

        // ✅ Update state with newly returned draft info
        setFormData((prev) => ({
          ...prev,
          ...responseData,
          moc_request_no: moc_request_no,
        }));
      } else {
        toast.error("Failed to save draft", { autoClose: 1200 });
      }
    } catch (error) {
      console.error("❌ Error while saving draft:", error);
      toast.error("Something went wrong while saving draft", { autoClose: 1200 });
    } finally {
      setLoading(false);
    }
  };


  const handleNext = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        submittion_date: new Date().toISOString().slice(0, 10)
      };

      console.log("payload from parent", payload);

      const response = await api.post("/api/MOC/CreateMocRequest", payload);



      if ([200, 201].includes(response.status)) {
        const responseData = response.data?.message?.data;
        const moc_request_no = responseData?.moc_request_no;
        const moc_request_id = responseData?.moc_request_id;

        toast.success("Request Created Successfully!", { autoClose: 1200 });

        // ✅ Upload files only when Save/Save Draft button was clicked
        if (moc_request_no && moc_request_id) {
          await uploadMocFiles(moc_request_id, moc_request_no);
        }

        // ✅ Redirect to next form
        setTimeout(() => {
          navigate("/station-operations/moc/next-request-form", {
            state: {
              step: 2,
              moc_request_no,
              station: payload.station_name,
            },
          });
        }, 1000);
      } else {



        toast.error("Failed to create request", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error creating MoC Request:", error);
      toast.error("Something went wrong while creating request", { autoClose: 1200 });
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
        <div className="rounded-md mb-1">
          <MocTopHeader title="MoC New Request" />
        </div>
        <StepIndicator currentStep={currentStep} />
        <MoCRequestForm
          currentStep={currentStep}
          handleCancel={handleCancel}
          handleNext={handleNext}
          handleBack={handleBack}
          // handleSave={handleSave}
          loading={loading}
          formData={formData}
          setFormData={setFormData}
          onFilesSelected={setFiles}
          handleSaveDraft={handleSaveDraft}
        />
      </div>
    </div>
  );
};

export default MocRequestCreation;
