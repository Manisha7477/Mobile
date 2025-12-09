import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import MoCRequestForm from "@/components/MocReview/MoCRequestForm";
import api from "@/api/axiosInstance";
import { View } from "lucide-react";
import ViewMocForm from "./ViewMocForm";

interface MocRequestCreationProps {
  onCancel?: () => void;  
  moc_request_no?: string;

}

const ParentViewMocForm: React.FC<MocRequestCreationProps> = ({ onCancel, moc_request_no }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [mocData, setMocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        if (Array.isArray(data)) {
          data = data[0];
        }
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
    <div >
      <div >        
        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <p className="text-gray-600 text-sm">Loading MoC data...</p>
          </div>
        ) : (
          <ViewMocForm
            mocData={mocData}
          />
        )}
      </div>
    </div>
  );
};

export default ParentViewMocForm;