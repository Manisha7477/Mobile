import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axiosInstance";

import GatePassHeader from "@/components/GatePassOutward/GatePassHeader";
import InwardGatePassBasicInfo from "../GatePassInward/InwardGatePassBasicInfo";
import InwardMaterialInfo from "../GatePassInward/InwardMaterialInfo";
// import InwardPhotoDocumentation from "@/components/GatePassInward/InwardPhotoDocumentation";
// import InwardApprovalSection from "@/components/GatePassInward/InwardApprovalSection";
// import FormActionsForRejectApprove from "../GatePassOutward/FormActionsForRejectApprove";

import { Approver, Material } from "@/utils/types";
import FormActionsRejectApprove from "./FormActionsRejectApprove";
import InwardPhotoDocumentationForApproval from "../GatePassInward/InwardPhotoDocumentationForApproval";
import InwardApprovalSectionDisplay from "../GatePassInward/InwardApprovalSectionDisplay";
import { toast } from "react-toastify";

const InwardApprovalForm: React.FC = () => {
    const navigate = useNavigate();
    const { inward_id } = useParams();   // ✅ Correct param

    const [loading, setLoading] = useState(true);
    const [approvers, setApprovers] = useState<Approver[]>([]);
    const [stationList, setStationList] = useState<string[]>([]);

    // Photos object
    const [photos, setPhotos] = useState({
        vehicle_photo: "",
        delivery_personnel_photo: "",
        delivery_personnel_id_photo: "",
        goods_photo: ""
    });

    // Build image URL from server
    const buildUrl = (filePath: string) => {
        if (!filePath) return "";
        const cleaned = filePath.replace(/\\/g, "/");
        const fileName = cleaned.substring(cleaned.lastIndexOf("/") + 1);
        return `http://122.166.153.170:8084/files/gate_pass/${fileName}`;
    };

    const [formData, setFormData] = useState({
        gatePassNo: "",
        dateTime: "",
        station: "",
        poType: "",
        poNumber: "",
        receivedFrom: "",
        supplierAddress: "",
        referenceDoc: "",
        purpose: "",
        vehicleNo: "",
        driverName: "",
        driverPhone: "",
        initiatorName: "",
        approverName: "",
        securityGuard: "",
        status: "",
    });

    const [materials, setMaterials] = useState<Material[]>([]);

    const toDateTimeLocal = (value: string | null) => {
        if (!value) return "";
        return value.split(".")[0].slice(0, 16);
    };

    // 🔥 FETCH INWARD GATE PASS BY ID
    useEffect(() => {
        if (!inward_id) return;

        const fetchData = async () => {
            try {
                const res = await api.get(`/api/GatePass/IG/IGgetby_id/${inward_id}`);

                const data = res.data.get_inward_gate_pass_by_id;
                const inward = data.inward_details;

                setStationList([inward.station]);

                // Set Basic Info
                setFormData({
                    gatePassNo: inward.gate_pass_no,
                    dateTime: toDateTimeLocal(inward.date_time),
                    station: inward.station,
                    poType: inward.po_type,
                    poNumber: inward.po_number,
                    receivedFrom: inward.received_from,
                    supplierAddress: inward.supplier_address,
                    referenceDoc: inward.reference_document,
                    purpose: inward.purpose,
                    vehicleNo: inward.vehicle_no,
                    driverName: inward.driver_name,
                    driverPhone: inward.driver_phone,
                    initiatorName: inward.created_by,
                    approverName: inward.approver_name,
                    securityGuard: inward.security_guard,
                    status: inward.status,
                });

                // 🌟 Materials Mapping
                setMaterials(
                    data.materials.map((m: any) => ({
                        id: String(m.id),
                        description: m.description,
                        orderedQty: m.ordered_quantity,
                        receivedQty: m.received_quantity,
                        unit: m.unit,
                        returnable: "",
                        remarks: m.remarks,
                        photo: buildUrl(m.goods_photo),
                    }))
                );

                // 🌟 Photos Mapping
                if (data.photos && data.photos.length > 0) {
                    const p = data.photos[0];

                    setPhotos({
                        vehicle_photo: buildUrl(p.vehicle_photo),
                        delivery_personnel_photo: buildUrl(p.delivery_personnel_photo),
                        delivery_personnel_id_photo: buildUrl(p.delivery_personnel_id_photo),
                        goods_photo: buildUrl(p.goods_photo),
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error("❌ Inward fetch error:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [inward_id]);

    // 🔥 UPDATE APPROVAL STATUS
    const updateInwardStatus = async (newStatus: string) => {
        try {
            const form = new FormData();

            form.append(
                "data",
                JSON.stringify({
                    inward_id,
                    gate_pass_no: formData.gatePassNo,
                    date_time: formData.dateTime,
                    station: formData.station,
                    po_type: formData.poType,
                    po_number: formData.poNumber,
                    received_from: formData.receivedFrom,
                    supplier_address: formData.supplierAddress,
                    reference_document: formData.referenceDoc,
                    purpose: formData.purpose,
                    vehicle_no: formData.vehicleNo,
                    driver_name: formData.driverName,
                    driver_phone: formData.driverPhone,
                    security_guard: formData.securityGuard,
                    approver_name: formData.approverName,
                    updated_by: formData.initiatorName,

                    status: newStatus,   // <-- APPROVED / REJECTED
                })
            );

            // no new photos in approval
            form.append("vehicle_photo", "");
            form.append("delivery_personnel_photo", "");
            form.append("delivery_personnel_id_photo", "");
            form.append("goods_photo", "");

            // FINAL API CALL
            await api.put(`/api/GatePass/IG/${inward_id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast(`Status updated to ${newStatus}`);
            navigate("/station-operations/gate-pass");

        } catch (err) {
            console.error("Status update failed:", err);
        }
    };
    if (loading) return <div className="p-10 text-center">Loading Inward Gate Pass…</div>;
    return (
        <div className="flex flex-col h-screen text-gray-800 text-[12px]">
            <GatePassHeader title="Inward Gate Pass" subtitle="Review & Approval" />
            <main className="flex-1 overflow-y-auto pb-40 sm:pb-24 hide-scrollbar">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="bg-white rounded-lg shadow p-8">
                        <InwardGatePassBasicInfo
                            formData={formData}
                            // stations={stationList}
                            onChange={() => { }}
                            showGatePassNo
                        />
                        <InwardMaterialInfo
                            materials={materials}
                            setMaterials={() => { }}
                        />
                        <InwardPhotoDocumentationForApproval initialPhotos={photos} />
                        <InwardApprovalSectionDisplay

                            securityGuard={formData.securityGuard}
                            approverName={formData.approverName}
                        />
                    </div>
                </div>
            </main>
            <footer className="bg-white border-t shadow-md py-2 fixed bottom-0 left-0 right-0">
                <div className="max-w-7xl mx-auto px-6 flex justify-end gap-6">
                    <FormActionsRejectApprove
                        inward_id={inward_id || ""}
                        onCancel={() => navigate("/station-operations/gate-pass")}
                        onPrintPreview={() => navigate(`/station-operations/gate-pass/inward/preview/${inward_id}`)}
                        onReject={() => updateInwardStatus("Rejected")}
                        onApprove={() => updateInwardStatus("Approved")}
                    />
                </div>
            </footer>
        </div>
    );
};

export default InwardApprovalForm;
