import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axiosInstance";
 
import GatePassHeader from "../GatePassOutward/GatePassHeader";
import GatePassBasicInfo from "../GatePassOutward/GatePassBasicInfo";
import PhotoDocumentation from "../GatePassOutward/PhotoDocumentation";
import MaterialDetailsTable from "../GatePassOutward/MaterialDetailsTable";
import ApprovalSection from "../GatePassOutward/ApprovalSection";
import FormActionsForRejectApprove from "../GatePassOutward/FormActionsForRejectApprove";
 
import { Approver, Material } from "@/utils/types";
import PhotoDocumentationApproval from "./PhotoDocumentationApproval";
import ApprovalSection2 from "./ApprovalSection2";
import ApprovalGatePassBasicInfo from "./ApprovalGatePassBasicInfo";
 
const OutwardGatePassApprovalForm: React.FC = () => {
  const navigate = useNavigate();
  const { outward_id } = useParams();
 
  const [loading, setLoading] = useState(true);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [stationList, setStationList] = useState<string[]>([]);
 
  const [photos, setPhotos] = useState({
    vehicle_photo: "",
    delivery_personnel_photo: "",
    delivery_personnel_id_photo: "",
    goods_photo: ""
  });
 
  const buildUrl = (filePath: string) => {
    if (!filePath) return "";
 
    // Clean Windows path (convert \\ into /)
    const cleaned = filePath.replace(/\\/g, "/");
 
    // Extract file name
    const fileName = cleaned.substring(cleaned.lastIndexOf("/") + 1);
 
    return `http://122.166.153.170:8084/files/gate_pass/${fileName}`;
  };
 
 
  const [formData, setFormData] = useState({
    gatePassNo: "",
    dateTime: "",
    station: "",
    issuingAuthority: "",
    contractorName: "",
    purpose: "",
    address: "",
    takenBy: "",
    vehicleNo: "",
    driverPhone: "",
    initiatorName: "",
    approver_name: "",
  });
 
  const [materials, setMaterials] = useState<Material[]>([]);
 
  const toDateTimeLocal = (value: string) => {
    if (!value) return "";
    return value.split(".")[0].slice(0, 16);
  };
 
  useEffect(() => {
    if (!outward_id) return;
 
    const fetchData = async () => {
      try {
        const res = await api.get(`/api/GatePass/OG/${outward_id}`);
        const data = res.data.data;
 
        const outward = data.outward;
 
        setStationList([outward.station]);
        setApprovers(data.approvers || []);
 
        setFormData({
          gatePassNo: outward.gate_pass_no,
          dateTime: toDateTimeLocal(outward.date_time),
          station: outward.station,
          issuingAuthority: outward.issuing_authority,
          contractorName: outward.department_contractor_name,
          purpose: outward.purpose,
          address: outward.address,
          takenBy: outward.material_taken_by,
          vehicleNo: outward.vehicle_no,
          driverPhone: outward.driver_phone,
          initiatorName: outward.initiator_name,
          approver_name: outward.approver_name,
        });
 
        setMaterials(
          data.materials.map((m: any) => ({
            id: String(m.id),
            description: m.description,
            orderedQty: m.quantity,
            receivedQty: m.quantity,
            unit: m.unit,
            returnable: m.returnable ? "Yes" : "No",
            remarks: m.remarks,
            photo: buildUrl(m.goods_photo),
          }))
        );
 
        // 🔥 Photo FIX
        if (data.photos && data.photos.length > 0) {
          const p = data.photos[0];
 
          const mappedPhotos = {
            vehicle_photo: buildUrl(p.vehicle_photo),
            delivery_personnel_photo: buildUrl(p.delivery_personnel_photo),
            delivery_personnel_id_photo: buildUrl(p.delivery_personnel_id_photo),
            goods_photo: buildUrl(p.goods_photo),
          };
 
          console.log("📸 Final Photo URLs sent to component:", mappedPhotos);
 
          setPhotos(mappedPhotos);
        }
 
        setLoading(false);
      } catch (err) {
        console.log("ERROR:", err);
        setLoading(false);
      }
    };
 
    fetchData();
  }, [outward_id]);
 
  if (loading) {
    return <div className="p-10 text-center">Loading Gate Pass…</div>;
  }
 
  const updateOutwardStatus = async (newStatus: string) => {
    try {
      const form = new FormData();
 
      form.append("data", JSON.stringify({
        outward_id: outward_id,
        gate_pass_no: formData.gatePassNo,
        date_time: formData.dateTime,
        station: formData.station,
        issuing_authority: formData.issuingAuthority,
        department_contractor_name: formData.contractorName,
        purpose: formData.purpose,
        address: formData.address,
        material_taken_by: formData.takenBy,
        vehicle_no: formData.vehicleNo,
        driver_phone: formData.driverPhone,
        initiator_name: formData.initiatorName,
        approver_name: formData.approver_name,
        updated_by: formData.initiatorName,
        status: newStatus
      }));
 
      // No new photos in approval/reject mode
      form.append("vehicle_photo", "");
      form.append("delivery_personnel_photo", "");
      form.append("delivery_personnel_id_photo", "");
      form.append("goods_photo", "");
 
      await api.put(`/api/GatePass/OG/${outward_id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
 
      navigate("/station-operations/gate-pass");
 
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };
 
 
 
  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-800 text-sm overflow-hidden">
 
      <GatePassHeader title="Outward Gate Pass" subtitle="Materials Leaving Premises" />
 
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow p-8">
 
            <ApprovalGatePassBasicInfo
              formData={formData}
              stations={stationList}
              onChange={() => { }}
              showGatePassNo
            />
 
            <MaterialDetailsTable materials={materials} setMaterials={() => { }} />
 
            {/* 🔥 Photos Now Render Correctly */}
            <PhotoDocumentationApproval initialPhotos={photos} />
 
            <ApprovalSection2
              approvers={approvers}
              initiatorName={formData.initiatorName}
              approver_name={formData.approver_name}
            />
 
          </div>
        </div>
      </main>
 
      <footer className="bg-white border-t shadow-md py-2 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-6 flex justify-end gap-6">
          <FormActionsForRejectApprove
            onCancel={() => navigate("/station-operations/gate-pass")}
             onPrintPreview={() => navigate(`/station-operations/gate-pass/outward/preview/${outward_id}`)}
            onReject={() => updateOutwardStatus("Rejected")}
            onApprove={() => updateOutwardStatus("Pending Verification")}
          />         
        </div>
      </footer>
 
    </div>
  );
};
 
export default OutwardGatePassApprovalForm;
 