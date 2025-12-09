import React, { useEffect, useState } from 'react'
import MocTopHeader from '../moc/MocTopHeader'
import { useNavigate, useParams } from 'react-router-dom';

import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import MocClosurePreview from '../MocClosure/MocClosurePreview';
interface MocRequestCreationProps {
    onCancel?: () => void;
    moc_request_no?: string;
}
const ViewMocClosure: React.FC<MocRequestCreationProps> = ({ onCancel,moc_request_no }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [formData, setFormData] = useState<any>({});
      const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [closureExists, setClosureExists] = useState(false);
    const navigate = useNavigate();

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
                    <div>
                        {/* Scrollable Form Content */}
                        <div className="flex-1 overflow-y-auto px-4 mt-3 border-b">

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
                    </div>
        </>
    )
}

export default ViewMocClosure