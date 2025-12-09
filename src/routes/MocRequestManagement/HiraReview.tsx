import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import MoCRequestForm from "./MocRequestForm";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import HiraReviewForm from "./HiraReviewForm";

interface HiraReviewProps {
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
            currentStep === 2
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

const HiraReview: React.FC<HiraReviewProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<MocFormData>({
    station_name: "Mangalore",
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
    status: "Pending Review",
    is_active: true,
    created_by: "Admin_1",
    updated_by: "admin",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    setLoading(true);
    try {
      const payload = { ...formData };
      console.log("payload from parent", payload);

      const response = await api.post("/api/MOC/GetByUser", payload);

      if ([200, 201].includes(response.status)) {
        toast.success("Request Created Successfully!", { autoClose: 1200 });
        setTimeout(() => {
          setCurrentStep(2);
          navigate("/station-operations/moc/next-request-form", {
            state: { step: 2 },
          });
        }, 1300);
      } else {
        toast.error("Failed to create request", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error creating MoC Request:", error);
      toast.error("Something went wrong while creating request", {
        autoClose: 1200,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const confirmSaveChanges = async () => {
    setShowConfirmModal(false);
    try {
      const response = await api.post(`/moc/save`, {
        ...formData,
        status: "Draft",
      });

      if ([200, 201].includes(response.status)) {
        toast.success("Data Saved Successfully!", { autoClose: 1200 });
        setTimeout(() => handleNext(), 1300);
      } else {
        toast.error("Failed to save data", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error while saving draft:", error);
      toast.error("Something went wrong while saving", { autoClose: 1000 });
    }
  };

  const handleCancel = () =>
    onCancel ? onCancel() : navigate("/station-operations/moc");
  const handleBack = () => setCurrentStep(1);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col h-full p-1">
        <div className="p-1 rounded-md mb-1">
          <MocTopHeader title="Review MoC Request" />
        </div>

        <StepIndicator currentStep={currentStep} />

        {/* ✅ PASS formData and setFormData as props */}
        <HiraReviewForm
          currentStep={currentStep}
          handleCancel={handleCancel}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSave={handleSave}
          loading={loading}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Confirm Save Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Confirm Save</h2>
              <p className="mb-6">Are you sure you want to save this draft?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={confirmSaveChanges}
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                >
                  Yes, Save
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiraReview;