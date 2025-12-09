
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GatePassHeader from "@/components/GatePassOutward/GatePassHeader";
import { Approver, Material } from "@/utils/types";
//import InwardGatePassBasicInfo from "@/components/GatepassManagement/GatePassBasicInfo";
//import FormActionsSubmit from "@/components/GatepassManagement/FormActionsSubmit";
import InwardGatePassBasicInfo from "@/components/GatePassInward/InwardGatePassBasicInfo";

import api from "@/api/axiosInstance";
import InwardActionButtons from "../GatePassInward/InwardActionButton";
import InwardApprovalSection from "@/components/GatePassInward/InwardApprovalSection";
import { toast } from "react-toastify";
import InwardMaterialInfo from "../GatePassInward/InwardMaterialInfo";
import InwardPhotoDocumentation from "../GatePassInward/InwardPhotoDocumentation";

//import BasicInfo from "@/components/GatepassManagement/InwordGatePass/BasicInfo";

const InwardGatePassForm: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApprover, setSelectedApprover] = useState("");



  useEffect(() => {
    const raw = localStorage.getItem("userData");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const getCurrentDateTime = () => {
    const local = new Date();
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 16);
  };
  // ✅ Form data
  const [formData, setFormData] = useState({
    dateTime: getCurrentDateTime(),
    gatePassNo: "",
    station: "",
    purpose: "",
    poType: "",
    poNumber: "",
    receivedFrom: "",
    supplierAddress: "",
    referenceDoc: "",
    securityGuardName: "",
    vehicleNo: "",
    driverName: "",
    driverPhone: "",
  });


  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      station: user.stationName,
    }));
  }, [user]);

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      description: "",
      orderedQty: 0,
      receivedQty: 0,
      unit: "",
      returnable: "",
      remarks: "",
      photo: ""
    },
  ]);


  const [photoDocs, setPhotoDocs] = useState<(string | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  useEffect(() => {
    if (!user?.userId) return;

    api
      .get(`/api/MOC/GetALlEngineersDD?user_id=${user.userId}`)
      .then((res) => {
        const list =
          res.data?.data?.map((eng: any) => ({
            id: String(eng.user_id),
            name: `${eng.first_name || ""} ${eng.last_name || ""} - ${eng.role_name}`.trim(),
            username: eng.username,
            approver_id: eng.user_id,     // <-- FIXED
          })) || [];

        setApprovers(list);
      });
  }, [user]);

  const handleApprove = async (type: "Pending Approval" | "draft") => {
    try {
      const selected = approvers.find((a) => a.id === selectedApprover);

      // ---------------------------
      // 1️⃣ BUILD PAYLOAD
      // ---------------------------
      const payload = {
        date_time: formData.dateTime,
        po_type: formData.poType || "",
        po_number: formData.poNumber || null,
        received_from: formData.receivedFrom || null,
        supplier_address: formData.supplierAddress || null,
        reference_document: formData.referenceDoc || "",
        purpose: formData.purpose || "",
        station: formData.station || "",
        vehicle_no: formData.vehicleNo || null,
        driver_name: formData.driverName || null,
        driver_phone: formData.driverPhone || null,
        security_guard: formData.securityGuardName || "",

        approver_id: selected?.approver_id ?? null,
        approver_name: selected?.name ?? "",

        uploaded_by: user?.username,
        created_by: user?.username,
        updated_by: user?.username,

        status: type === "draft" ? "Draft" : "Pending Approval",
      };

      console.log("PAYLOAD SENT:", payload);

      // ---------------------------
      // 2️⃣ VALIDATE PHOTOS
      // ---------------------------
      const [vPhoto, dpPhoto, idPhoto, goodsPhoto] = photoDocs;



      // ---------------------------
      // 3️⃣ CREATE FORMDATA
      // ---------------------------
      const form = new FormData();
      form.append("data", JSON.stringify(payload));

      const base64ToFile = (base64: string, filename: string): File => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
      };

      if (vPhoto) {
        form.append("vehicle_photo", base64ToFile(vPhoto, "vehicle.png"));
      }

      if (dpPhoto) {
        form.append("delivery_personnel_photo", base64ToFile(dpPhoto, "person.png"));
      }

      if (idPhoto) {
        form.append("delivery_personnel_id_photo", base64ToFile(idPhoto, "id.png"));
      }

      if (goodsPhoto) {
        form.append("goods_photo", base64ToFile(goodsPhoto, "goods.png"));
      }

      // ---------------------------
      // 4️⃣ CALL API — CREATE INWARD
      // ---------------------------
      const res = await api.post("/api/GatePass/IG/IGgetcreate", form);
      console.log("CREATE INWARD RESPONSE:", res.data);

      const inwardId = res.data?.inward_id?.inward_id;
      const gatePassNo = res.data?.inward_id?.gate_pass_no;


      if (!inwardId) {
        toast.error("❌ inward_id missing from backend!");
        return;
      }

      setFormData((prev) => ({ ...prev, gatePassNo }));

      // ---------------------------
      // 5️⃣ SAVE MATERIALS
      // ---------------------------
      for (const m of materials) {
        if (!m.photo) {
          toast.error(`Photo missing for material row ${m.id}`);
          return;
        }

        const matForm = new FormData();

        matForm.append(
          "request",
          JSON.stringify({
            inward_id: inwardId,
            description: m.description?.trim() || "",
            ordered_quantity: Number(m.orderedQty) || 0,
            received_quantity: Number(m.receivedQty) || 0,
            unit: m.unit?.trim() || "nos",
            remarks: m.remarks?.trim() || "",
          })
        );

        const blob = await fetch(m.photo).then((r) => r.blob());
        matForm.append("goods_photo", new File([blob], "material.png"));

        const materialRes = await api.post("/api/GatePass/MG/CreateIGPMaterial", matForm);
        console.log("MATERIAL RESPONSE:", materialRes.data);
      }

      toast.success("Inward Gate Pass Submitted Successfully!");
      navigate("/station-operations/gate-pass");

    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Submission failed.");
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  ;

  return (
    <div className="flex flex-col h-screen text-gray-800 text-[12px]">
      {/* ===== HEADER ===== */}
      <GatePassHeader
        title="Inward Gate Pass"
        subtitle="Materials Entering Premises"
      />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-40 sm:pb-24">
        <div className="max-w-7xl mx-auto px-3 py-2 w-full">
          <div className="bg-white p-2 space-y-2">
            {/* ===== BASIC INFO ===== */}
            <InwardGatePassBasicInfo
              formData={formData}
              onChange={handleChange} />
            <InwardMaterialInfo
              materials={materials}
              setMaterials={setMaterials}
            />


            {/* ===== PHOTO DOCUMENTATION ===== */}
            <InwardPhotoDocumentation onPhotosChange={setPhotoDocs} />

            <InwardApprovalSection
              approvers={approvers}
              onChange={({ approverId, securityGuardName }) => {
                setSelectedApprover(approverId);
                setFormData((prev) => ({
                  ...prev,
                  securityGuardName: securityGuardName,   // <-- IMPORTANT
                }));
              }}
            />




          </div>
        </div>
      </main>

      {/* ===== FIXED FOOTER ===== */}
      <footer className="bg-white border-t shadow-md  px-3 fixed bottom-0 left-0 right-0 ">
        <div className="max-w-7xl mx-auto flex justify-end">
          <InwardActionButtons
            onCancel={() => navigate("/station-operations/gate-pass")}

            onSubmit={() => handleApprove("Pending Approval")}
          />
        </div>
      </footer>
    </div>
  );
};

export default InwardGatePassForm;
