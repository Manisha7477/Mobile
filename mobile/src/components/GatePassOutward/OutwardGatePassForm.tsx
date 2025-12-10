import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Approver, Material } from "@/utils/types";
import GatePassHeader from "../GatePassOutward/GatePassHeader";
import GatePassBasicInfo from "../GatePassOutward/GatePassBasicInfo";
import MaterialDetailsTable from "../GatePassOutward/MaterialDetailsTable";
import PhotoDocumentation from "../GatePassOutward/PhotoDocumentation";
import ApprovalSection from "../GatePassOutward/ApprovalSection";
import FormActionsApproval from "../GatePassOutward/FormActionsApproval";
import { toast } from "react-toastify";

const OutwardGatePassForm: React.FC = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        gatePassNo: "",
    });

    useEffect(() => {
        if (!user) return;
        setFormData((prev) => ({
            ...prev,
            station: user.stationName,
        }));
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
        },
    ]);
    const [photoDocs, setPhotoDocs] = useState<(string | null)[]>([
        null,
        null,
        null,
        null,
    ]);

    /** Approvers */
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [selectedApprover, setSelectedApprover] = useState("");

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

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };
    const handleApprove = async (type: "Pending Approval" | "draft") => {

        if (isSubmitting) return;   
        setIsSubmitting(true);
        try {
            const selected = approvers.find((a) => a.id === selectedApprover);

            const payload = {
                station: formData.station,
                issuing_authority: formData.issuingAuthority,
                department_contractor_name: formData.contractorName,
                address: formData.address,
                material_taken_by: formData.takenBy,
                purpose: formData.purpose || "",
                vehicle_no: formData.vehicleNo,
                driver_phone: formData.driverPhone,
                approver_id: selected?.approver_id ?? null,  
                approver_name: selected?.username ?? "",    
                initiator_name: user?.username,
                created_by: user?.username,
                status: type === "draft" ? "draft" : "Pending Approval",
            };

            console.log("PAYLOAD SENT:", payload);
    
            const form = new FormData();
            form.append("data", JSON.stringify(payload));

            const [vPhoto, dpPhoto, idPhoto, goodsPhoto] = photoDocs;

            const base64ToFile = (base64: string, filename: string): File => {
                const arr = base64.split(",");
                const mime = arr[0].match(/:(.*?);/)![1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) u8arr[n] = bstr.charCodeAt(n);
                return new File([u8arr], filename, { type: mime });
            };

            if (vPhoto) form.append("vehicle_photo", base64ToFile(vPhoto, "vehicle.png"));
            if (dpPhoto) form.append("delivery_personnel_photo", base64ToFile(dpPhoto, "person.png"));
            if (idPhoto) form.append("delivery_personnel_id_photo", base64ToFile(idPhoto, "id.png"));
            if (goodsPhoto) form.append("goods_photo", base64ToFile(goodsPhoto, "goods.png"));

            const res = await api.post("/api/GatePass/OG/create", form);
            console.log("CREATE OUTWARD RESPONSE:", res.data);

            setFormData((prev) => ({ ...prev, gatePassNo }));

            const selectedEngineer = approvers.find((a) => a.id === selectedApprover);

            const outwardId = res.data?.data?.data?.outward?.outward_id;
            const gatePassNo = res.data?.data?.data?.outward?.gate_pass_no;

            // const rgPayload = {
            //     outward_id: outwardId,
            //     created_by: user?.username,
            //     approver_name: selectedEngineer?.name || ""
            // };

            // console.log("RETURNABLE GP PAYLOAD:", rgPayload);

            // const rgRes = await api.post(
            //     "/api/GatePassRG/create-from-outward",
            //     rgPayload
            // );

            // console.log("RETURNABLE GP RESPONSE:", rgRes.data);
            setFormData((prev) => ({ ...prev, gatePassNo }));
            for (const m of materials) {
                if (!m.photo) {
                    toast.error(`Photo missing for material row ${m.id}`);
                    setIsSubmitting(false);
                    return;
                }
                const matForm = new FormData();
                matForm.append(
                    "request",
                    JSON.stringify({
                        outward_id: outwardId,
                        description: m.description?.trim() || "",
                        quantity: Number(m.orderedQty) || 0,
                        unit: m.unit?.trim() || "nos",
                        returnable: m.returnable === "Yes",
                        remarks: m.remarks?.trim() || "",
                    })
                );
                const blob = await fetch(m.photo).then((r) => r.blob());
                matForm.append("goods_photo", new File([blob], "material.png"));
                const materialRes = await api.post("/api/GatePass/MG/CreateOGPMaterial", matForm);
                console.log("MATERIAL RESPONSE:", materialRes.data);

                const rgPayload = {
                    outward_id: outwardId,
                    created_by: user?.username,
                    approver_name: selectedEngineer?.name || ""
                };
                const rgRes = await api.post(
                    "/api/GatePassRG/create-from-outward",
                    rgPayload
                );
            }
            toast.success("Submitted Successfully!");
            navigate("/station-operations/gate-pass");
        } catch (err) {
            console.error("Submit failed:", err);
            toast.error("Submission failed.");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen text-gray-800 text-[12px]">
            <GatePassHeader
                title="Outward Gate Pass"
                subtitle="Materials Leaving Premises"
            />
            <main className="flex-1 overflow-y-auto hide-scrollbar pb-40 sm:pb-24">
                <div className="max-w-7xl mx-auto px-3 py-2 w-full">
                    <div className="bg-white rounded-lg shadow p-3 space-y-2">
                        <GatePassBasicInfo formData={formData} onChange={handleChange} />
                        <MaterialDetailsTable
                            materials={materials}
                            setMaterials={setMaterials}
                        />
                        <PhotoDocumentation onPhotosChange={setPhotoDocs} />
                        <ApprovalSection
                            approvers={approvers}
                            initiatorName={user?.username}
                            onChange={({ approverId }) => setSelectedApprover(approverId)}
                        />
                    </div>
                </div>
            </main>
            <footer className="bg-white border-t shadow-md px-3 fixed bottom-0 left-0 right-0">
                <div className="max-w-7xl mx-auto flex justify-end">
                    <FormActionsApproval
                        disabled={isSubmitting}
                        onCancel={() => !isSubmitting && navigate("/station-operations/gate-pass")}
                        onSave={() => !isSubmitting && handleApprove("draft")}
                        onApprove={() => !isSubmitting && handleApprove("Pending Approval")}
                    />
                </div>
            </footer>
        </div>
    );
};

export default OutwardGatePassForm;
