import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import MoCRequestForm from "@/components/MocReview/MoCRequestForm";
import api from "@/api/axiosInstance";

interface MocRequestCreationProps {
  onCancel?: () => void;
}

const HiraReviewMocRequest: React.FC<MocRequestCreationProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { moc_request_no } = useParams<{ moc_request_no: string }>();

  const [mocData, setMocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch MoC Data dynamically by moc_request_no
  useEffect(() => {
    const fetchMoCData = async () => {
      if (!moc_request_no) {
        console.error("moc_request_no missing");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching MOC →", moc_request_no);
        const res = await api.get(
          `/api/MOC/GetMocRequest?moc_request_no=${encodeURIComponent(moc_request_no)}`
        );

        console.log("Raw API Response →", res.data);

        let data = res.data;

        // If array, take first element
        if (Array.isArray(data)) {
          data = data[0];
        }

        // If nested (common .NET response)
        if (data?.data) {
          data = data.data;
        }

        console.log("Final mocData →", data);

        setMocData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
console.log("mocData",mocData);

    fetchMoCData();
  }, [moc_request_no]);

//  useEffect(() => {
//     const fetchMoCData = async () => {
//       try {
//        const res=await api.get(`/api/MOC/GetMocRequest?moc_request_no= Moc/MLR/2025-26/026`)
//        console.log("res",res.data.moc_request_no);
       
//         setMocData(res.data);
//       } catch (error) {
//         console.error("Error fetching MoC data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//        fetchMoCData();
//   }, [moc_request_no]);


  const handleNext = () => {
    if (!moc_request_no) {
      console.error("❌ moc_request_no is missing");
      return;
    }

    setCurrentStep(2);
    navigate(
      `/station-operations/moc/NextHiraReview/${encodeURIComponent(moc_request_no)}`,
      { state: { step: 2 } }
    );
  };

   const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/station-operations/moc");
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted");
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/station-operations/moc");
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col h-full p-1">
        {/* Header */}
        <div className="p-1 rounded-md mb-1">
          <MocTopHeader
            title="Review MoC Request"
            subTitle="Review all details before submission"
          />
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
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
              >
                1
              </div>
              <span
                className={`text-sm mt-1 whitespace-nowrap ${currentStep === 1
                    ? "text-blue-700 font-semibold"
                    : currentStep > 1
                      ? "text-green-600 font-semibold"
                      : "text-gray-600"
                  }`}
              >
                MOC Request Form
              </span>
            </div>

            {/* Connector Line */}
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
        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <p className="text-gray-600 text-sm">Loading MoC data...</p>
          </div>
        ) : (
          <MoCRequestForm
            currentStep={currentStep}
            handleCancel={handleCancel}
            handleNext={handleNext}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
            mocData={mocData}
          />
        )}
      </div>
    </div>
  );
};

export default HiraReviewMocRequest;