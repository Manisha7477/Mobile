

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MocTopHeader from "@/components/moc/MocTopHeader";
import api from "@/api/axiosInstance";
import ViewHiraForm from "./ViewHiraForm";

interface NextRequestFormProps {
  onCancel?: () => void;
  moc_request_no?: string;
}

const ParentViewHiraForm: React.FC<NextRequestFormProps> = ({ onCancel,moc_request_no }) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const data = location.state?.formData || {};


  return (
    <div >

      {/* ✅ Step Content */}
      <ViewHiraForm
        mocData={mocData}
      />
    </div>
  );
};

export default ParentViewHiraForm;