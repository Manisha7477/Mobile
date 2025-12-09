import React, { useEffect, useState } from 'react'
import MocTopHeader from '../moc/MocTopHeader'
import { useNavigate, useParams } from 'react-router-dom';

import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import MocClosurePreview from './MocClosurePreview';
interface MocRequestCreationProps {
    onCancel?: () => void;
}
const ReviewerClosure: React.FC<MocRequestCreationProps> = ({ onCancel }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState<any>({});
      const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [closureExists, setClosureExists] = useState(false);
    const navigate = useNavigate();
     const { moc_request_no } = useParams()

    useEffect(() => {
  const fetchMocRequest = async () => {
    if (!moc_request_no) return;
    try {
      const mocNo = decodeURIComponent(moc_request_no);
      const response = await api.get(`/api/MOC/GetMocRequest`, {
        params: { moc_request_no: mocNo },
      });

      const data = response.data;
      setClosureExists(data.closure_exists || false);

      if (data.closure_exists && data.closure_data) {
        // ✅ Closure exists → bind closure_data with fallback from main MOC
        setFormData({
          moc_request_no: data.moc_request_no,
          title_of_moc: data.closure_data.title_of_moc || data.title,
          date: data.closure_data.date || new Date().toISOString().slice(0, 10),
          brief_description: data.closure_data.brief_description || "",
          moc_initiator_dept: data.closure_data.moc_initiator_dept || "",
          executing_dept: data.closure_data.executing_dept || "",
          moc_execution_details: data.closure_data.moc_execution_details || "",
          job_start_date: data.closure_data.job_start_date || "",
          job_completion_date: data.closure_data.job_completion_date || "",
          hira_recommendation_status:
            data.closure_data.hira_recommendation_status || "",
          revised_operating_procedure:
            data.closure_data.revised_operating_procedure || "",
          training_completed: data.closure_data.training_completed || "",
          relevant_manuals: data.closure_data.relevant_manuals || "",
          comments_initiator: data.closure_data.comments_initiator || "",
          comments_reviewer: data.closure_data.comments_reviewer || "",
          status: data.closure_data.status || "Closed",
        });
      } else {
        // ✅ No closure exists → use defaults from base MOC
        setFormData({
          moc_request_no: data.moc_request_no,
          title_of_moc: data.title,
          date: new Date().toISOString().slice(0, 10),
          brief_description: "",
          moc_initiator_dept: "",
          executing_dept: "",
          moc_execution_details: "",
          job_start_date: "",
          job_completion_date: "",
          hira_recommendation_status: "",
          revised_operating_procedure: "",
          training_completed: "",
          relevant_manuals: "",
          comments_initiator: "",
          comments_reviewer: "",
          status: "Closed",
        });
      }
    } catch (error: any) {
      toast.error("Failed to load MOC Request details");
      console.error("Error fetching MOC request:", error);
    }
  };

  fetchMocRequest();
}, [moc_request_no]);

const handleSubmitClosure = async () => {
  try {
    if (!formData?.moc_request_no) {
      toast.warn("MOC Request number missing!", { autoClose: 1200 });
      return;
    }

    const payload = {
      ...formData,
      status: "Closed",
    };

   
  } catch (error: any) {
    console.error("Error submitting closure:", error);
    toast.error("Something went wrong while submitting", { autoClose: 1500 });
  }
};

  const handlePrintPreview = () => {
    setShowPrintPreview(true);
  };

  // ✅ Return from preview screen
  const handleBackFromPreview = () => {
    setShowPrintPreview(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/station-operations/moc");
        }
    };

    const handleSave = () => {
    if (!formData) return;
    setShowConfirmModal(true);
  };

      const confirmSaveChanges = async () => {
    setShowConfirmModal(false);
    if (!formData) return;


  
  };
    if (showPrintPreview) {
    return <MocClosurePreview data={formData} onBack={handleBackFromPreview} />;
  }

    return (
        <>
            <div className="p-1 rounded-md mb-2">
                {/* <MocTopHeader
                    title={moc_request_no}
                    subTitle="MoC Closure Request"
                /> */}
                   <MocTopHeader
          title={formData?.moc_request_no || "MOC Closure Request"}
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
                                    //   value={formData?.title || ""}
                                    value={formData?.title_of_moc || ""}
                                         readOnly
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
                                        value={formData?.moc_request_no || ""}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData?.date || ""}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Brief Description</label>
                                <textarea
                                    placeholder="Describe the concern/ system/ configuration"
                                    rows={3}
                                     value={formData?.brief_description || ""}
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
                                         value={formData?.moc_initiator_dept || ""}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Executing Department <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                         value={formData?.executing_dept || ""}
                                    onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">MoC Execution Details</label>
                                <textarea
                                    placeholder="Describe the concern/ system/ configuration"
                                    rows={3}
                                     value={formData?.moc_execution_details || ""}
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
                                        //name="job_start_date"
                                        value={formData?.job_start_date || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Job Completion Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData?.job_completion_date || ""}
                                        onChange={handleInputChange}
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
                                         value={formData?.hira_recommendation_status || ""}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Revised operating procedure prepared <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.revised_operating_procedure || ""}
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
                                         value={formData?.training_completed || ""}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Related Manual/Distributor documents <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData?.relevant_manuals || ""}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Comments (Initiator)
                                </label>
                                <textarea
                                     value={formData?.comments_initiator || ""}
                                    
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
                           <button
  onClick={handlePrintPreview}  // ✅ add this
  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center gap-2"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
  Print Preview
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

export default ReviewerClosure