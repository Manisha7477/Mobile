import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axiosInstance";

import { Approver, Material as BaseMaterial } from "@/utils/types";
import GatePassHeader from "../GatePassOutward/GatePassHeader";
import PhotoDocumentation from "../GatePassOutward/PhotoDocumentation";
import { toast } from "react-toastify";
import ReturnableBasicInfo from "./ReturnableBasicInfo";
import ReturnableFormAction from "./ReturnableFormActions";
import ReturnableMaterials from "./ReturnableMaterials";
import ReturnablePhotoDoc from "./ReturnablePhotoDoc";
import ReviewReturnableApprovalAction from "./ReviewReturnableApprovalAction";

/** -------------------------
  FIX: EXTEND Material TYPE
--------------------------*/
interface Material extends BaseMaterial {
  returnQty: number;
  condition: string;
}

const ReturnableApproval: React.FC = () => {
  const navigate = useNavigate();
  const { outward_id } = useParams();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("userData");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const getCurrentDateTime = () => {
    const local = new Date();
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    dateTime: getCurrentDateTime(),
    station: "",
    issuingAuthority: "",
    contractorName: "",
    address: "",
    takenBy: "",
    purpose: "",
    vehicleNo: "",
    driverPhone: "",
    driver_name: "",
    outward_gate_pass_no: "",
    department_contractor_name: "",
    returnable_gate_pass_no: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        station: user.stationName,
      }));
    }
  }, [user]);

  /** Materials */
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      description: "",
      orderedQty: 0,
      receivedQty: 0,
      unit: "",
      returnable: "",
      remarks: "",
      photo: "",
      returnQty: 0,
      condition: "",
    },
  ]);

  /** Photos */
  const [photoDocs, setPhotoDocs] = useState<(string[] | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApprover, setSelectedApprover] = useState("");

  /** GET OUTWARD DETAILS */
  useEffect(() => {
    if (!user || !outward_id) return;

    api
      .get(`/api/GatePassRG/track?outward_id=${outward_id}`)
      .then((res) => {
        const data = res.data?.data;
        if (!data) return;

        const outward = data;
        const materialsList = data.materials || [];
        const photos = data.photos?.[0] || {};

        setFormData({
          dateTime: outward.date_time?.slice(0, 16) || getCurrentDateTime(),
          station: outward.station || "",
          issuingAuthority: outward.issuing_authority || "",
          contractorName: outward.department_contractor_name || "",
          address: outward.supplier_address || "",
          takenBy: outward.material_taken_by || "",
          purpose: outward.purpose || "",
          vehicleNo: outward.vehicle_no || "",
          driverPhone: outward.driver_phone || "",
          driver_name: outward.driver_name || "",
          outward_gate_pass_no: outward.outward_gate_pass_no || "",
          department_contractor_name: outward.department_contractor_name || "",
          returnable_gate_pass_no: outward.returnable_gate_pass_no || "",
        });

        setMaterials(
          materialsList.map((m: any, index: number) => ({
            id: String(index + 1),
            description: m.description,
            orderedQty: m.actual_quantity,
            receivedQty: m.received_quantity,
            unit: m.unit,
            returnable: m.returnable ? "Yes" : "No",
            remarks: m.remarks,
            photo: m.goods_photo,
            returnQty: m.return_quantity ?? 0,
            condition: m.condition ?? "",
          }))
        );

        setPhotoDocs([
          photos.vehicle_photo ? [photos.vehicle_photo] : null,
          photos.delivery_personnel_photo ? [photos.delivery_personnel_photo] : null,
          photos.delivery_personnel_id_photo ? [photos.delivery_personnel_id_photo] : null,
          photos.goods_photo ? [photos.goods_photo] : null,
        ]);
      })
      .catch((err) => console.error("Fetch outward failed", err));
  }, [user, outward_id]);

  /** Change Handler */
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /** Convert Base64 → File */
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  /** Submit */
  const handleApprove = async (type: "Approved" | "Rejected") => {
    try {
      const form = new FormData();

      // top-level keys
      form.append("returnable_gate_pass_no", formData.returnable_gate_pass_no);
      form.append("uploaded_by", user?.username || "");
      form.append("status", type === "Rejected" ? "Rejected" : "Approved");

      // materials as JSON string
      const materialsPayload = materials.map((m) => ({
        description: m.description,
        unit: m.unit,
        returned_quantity: Number(m.returnQty),
        condition: m.condition,
        remarks: m.remarks,
        goods_photo: m.photo?.startsWith("data") ? "" : m.photo || "",
      }));
      form.append("materials", JSON.stringify(materialsPayload));

      // photos
      const [vPhotos, pPhotos, idPhotos, gPhotos] = photoDocs;

      form.append(
        "vehicle_photo",
        vPhotos?.[0] ? base64ToFile(vPhotos[0], "vehicle.png") : new File([], "empty.png")
      );
      form.append(
        "delivery_personnel_photo",
        pPhotos?.[0] ? base64ToFile(pPhotos[0], "person.png") : new File([], "empty.png")
      );
      form.append(
        "delivery_personnel_id_photo",
        idPhotos?.[0] ? base64ToFile(idPhotos[0], "id.png") : new File([], "empty.png")
      );
      form.append(
        "goods_photo",
        gPhotos?.[0] ? base64ToFile(gPhotos[0], "goods.png") : new File([], "empty.png")
      );

      await api.post("/api/GatePassRG/insert-return", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Returnable Gate Pass Submitted Successfully!");
      navigate("/station-operations/gate-pass");
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Error submitting returnable gate pass.");
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 text-[12px] overflow-hidden">
      <GatePassHeader
        title="Returnable Gate Pass"
        subtitle="Materials Leaving Premises"
      />

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="bg-white rounded-lg shadow p-3 space-y-2">
            <ReturnableBasicInfo formData={formData} onChange={handleChange} />

            <ReturnablePhotoDoc
              onPhotosChange={(photosLatest) => {
                // photosLatest: (string | null)[]
                setPhotoDocs((prev) =>
                  prev.map((arr, idx) => photosLatest[idx] ?? [])
                );
              }}
            />

            <ReturnableMaterials
              materials={materials}
              setMaterials={setMaterials}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t shadow-md px-3 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto flex justify-end">
          <ReviewReturnableApprovalAction
            onCancel={() => navigate("/station-operations/gate-pass")}
            onPrintPreview={() => navigate(`/station-operations/gate-pass/returnable/preview/${outward_id}`)}
            onReject={() => handleApprove("Rejected")}
            onApprove={() => handleApprove("Approved")}
          />
        </div>
      </footer>
    </div>
  );
};

export default ReturnableApproval;
