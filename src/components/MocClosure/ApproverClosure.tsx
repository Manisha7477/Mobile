import React, { useState } from 'react'
import MocTopHeader from '../moc/MocTopHeader'
import { useNavigate } from 'react-router-dom';
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
interface MocRequestCreationProps {
    onCancel?: () => void;
}
const ApproverClosure: React.FC<MocRequestCreationProps> = ({ onCancel }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const navigate = useNavigate();

    const handleCancel = () => {
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
      } else {
        toast.error("Failed to save data", { autoClose: 1000 });
      }
    } catch (error) {
      console.error("Error while saving:", error);
      toast.error("Something went wrong while saving", { autoClose: 1000 });
    }
  };

    return (
        <>
            <div className="p-1 rounded-md mb-2">
                <MocTopHeader
                    title="Moc/MLR/2025-26/001"
                    subTitle="MoC Closure Request"
                />
                <div className="mt-3 min-h-screen">
                    <div className="mx-auto bg-white border-t rounded-lg flex flex-col" style={{ height: 'calc(93vh - 120px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)' }}>
                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto px-4 mt-3 border-b">
                            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Title of the MoC <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Removal of Existing UCP panel at RM/BL and Installation of New Panel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        MoC Raquest No <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="MoC / IT - RM/BRE"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        defaultValue="2025-10-30"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Brief Description</label>
                                <textarea
                                    placeholder="Describe the concern/ system/ configuration"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        MoC Initiator Department <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="CISO - IT"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Executing Department <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="IT"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">MoC Execution Details</label>
                                <textarea
                                    placeholder="Describe the concern/ system/ configuration"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Job Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Job Completion Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        At HRR Recommendation Created and Closure <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Completed"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Revised operating procedure prepared <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Operating procedure not altered"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Training of concern person completed <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Trained to IT Engineers"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Related Manual/Distributor documents <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Not Applicable"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Comments (Initiator)
                                </label>
                                <textarea
                                    defaultValue="Nil"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* Fixed Footer Buttons */}
                        <div className="p-2 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                                Cancel
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Preview
                            </button>
                            <button
                            onClick={handleSave}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save Draft
                            </button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
        </>
    )
}

export default ApproverClosure