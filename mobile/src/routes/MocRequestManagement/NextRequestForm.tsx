"use client";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import NextRequestFormModel from "./NextRequestFormModel";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";

interface NextRequestFormProps {
  onCancel?: () => void;
}

const NextRequestForm: React.FC<NextRequestFormProps> = ({ onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  console.log("location", location);

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const stationName = parsedUser?.stationName;


  // Get step info from navigation state
  const currentStep = location.state?.step || 1;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/station-operations/moc");
    }
  };

  // const handleBack = () => navigate(-1);
  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/station-operations/moc");
    }
  };

  const handleNext = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/station-operations/moc");
    }
  };

  const handleSave = (data: any) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const confirmSaveChanges = async () => {
    setShowConfirmModal(false);
    try {
      const payload = {
        ...formData,
        status: "Draft",
      };

      const response = await api.post(`/moc/save`, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Data Saved Successfully!", { autoClose: 1200 });
        // move to next form / modal
        setTimeout(() => {
          handleNext();
        }, 1300);
      } else {
        toast.error("Failed to save data", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error while saving:", error);
      toast.error("Something went wrong while saving", { autoClose: 1000 });
    }
  };

  // Get data from navigation state
  const mocRequestNo = location.state?.moc_request_no || "";
  const station = location.state?.station || "";


  return (
    <div className="bg-white rounded-lg shadow-lg p-1 h-[88vh] flex flex-col justify-between">
      <div className="p-1 rounded-md mb-1">
        <MocTopHeader title="MoC New Request" />
      </div>

      {/* ✅ Step Indicator */}
      <div className="bg-white flex items-center justify-center sticky">
        <div className="flex items-center w-full max-w-md">
          {/* Step 1 */}
          <div className="flex flex-col items-center mr-0.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep === 1
                ? "bg-blue-700 text-white"
                : currentStep > 1
                  ? "text-white"
                  : "bg-gray-300 text-gray-600"
                }`}
              style={currentStep > 1 ? { backgroundColor: "#0DB721" } : {}}
            >
              1
            </div>
            <span
              className={`text-sm mt-1 whitespace-nowrap ${currentStep === 1
                ? "text-blue-700 font-semibold"
                : currentStep > 1
                  ? "font-semibold"
                  : "text-gray-600"
                }`}
              style={currentStep > 1 ? { color: "#0DB721" } : {}}
            >
              MOC Request Form
            </span>
          </div>

          {/* Connector Line */}
          <div
            className={`-ml-12 -mt-6 flex-1 h-1 ${currentStep > 1 ? "bg-gray-300" : "bg-gray-300"
              }`}
            style={currentStep > 1 ? { backgroundColor: "#0DB721" } : {}}
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
              className={`text-sm mt-1 whitespace-nowrap ${currentStep === 2
                ? "text-blue-700 font-semibold"
                : "text-gray-600"
                }`}
            >
              HIRA Form
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Step Content */}
      <NextRequestFormModel
        currentStep={currentStep}
        handleCancel={handleCancel}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSubmit={currentStep}
        handleSave={handleSave}
        mocRequestNo={location.state?.moc_request_no}
        stationName={stationName}
      />
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
  );
};

export default NextRequestForm;
