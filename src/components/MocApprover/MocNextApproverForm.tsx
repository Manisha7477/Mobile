

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import api from "@/api/axiosInstance";
import MocNextApproverFormModel from "./MocNextApproverFormModel";

interface NextRequestFormProps {
  onCancel?: () => void;
}

const MocNextApproverForm: React.FC<NextRequestFormProps> = ({ onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [setCurrentStep] = useState(1);
  const { moc_request_no } = useParams<{ moc_request_no: string }>();

  const [mocData, setMocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoCData = async () => {
      if (!moc_request_no) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/MOC/GetMocRequest?moc_request_no=${encodeURIComponent(moc_request_no)}`);
        console.log("✅ API Response:", res.data);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setMocData(data);
      } catch (error) {
        console.error("❌ Error fetching MoC data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoCData();
  }, [moc_request_no]);


 

  // Get step info from navigation state
  const currentStep = location.state?.step || 1;

   const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // ✅ Removed wrong colon before moc_request_no
      navigate(
        `/station-operations/moc/approver/${encodeURIComponent(
          moc_request_no || ""
        )}`
      );
    }
  };

  const data = location.state?.formData || {};

  const handleBack = () => {
    navigate(
      `/station-operations/moc/approver/${encodeURIComponent(
        moc_request_no || ""
      )}`
    );
  };


  return (
    <div className="bg-white rounded-lg shadow-lg p-1 h-[88vh] flex flex-col justify-between">
      <div className="p-1 rounded-md mb-1">
        <MocTopHeader title="Hira Review Request"
          subTitle="Review all details before submission" />
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
      <MocNextApproverFormModel
        currentStep={currentStep}
        handleCancel={handleCancel}
        handleBack={handleBack}
        handleSubmit={currentStep}
        mocData={mocData}   // ✅ pass fetched MoC data
        
      />
    </div>
  );
};

export default MocNextApproverForm;