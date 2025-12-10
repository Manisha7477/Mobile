import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Material {
    id: string;
    description: string;
    orderedQty: number;
    receivedQty: number;
    unit: string;
    returnable: string;
    remarks?: string;
    photo?: string;
    returnQty: number;
    condition: string;
}

interface MaterialDetailsTableProps {
    materials: Material[];
    setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const ReturnableMaterials: React.FC<MaterialDetailsTableProps> = ({
    materials,
    setMaterials,
}) => {
    const [activeCameraIndex, setActiveCameraIndex] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ [index: number]: Partial<Record<keyof Material, string>> }>({});

    const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
    const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
    const streamRefs = useRef<{ [key: number]: MediaStream | null }>({});
    const fileRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    /** ✅ Add Material Row */
    const addRow = () => {
        setMaterials((prev) => [
            ...prev,
            {
                id: String(prev.length + 1),
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
    };


    /** ✅ Validate Single Field */
    const validateField = (index: number, key: keyof Material, value: any) => {
        let error = "";

        switch (key) {
            case "description":
                if (!value.trim()) error = "Description is required.";
                break;
            case "orderedQty":
                if (value <= 0 || isNaN(value)) error = "Quantity must be greater than 0.";
                break;
            case "unit":
                if (!value.trim()) error = "Unit is required.";
                break;
            case "returnable":
                if (!value.trim()) error = "Select Yes or No.";
                break;
            case "photo":
                if (!value) error = "Photo is required.";
                break;
            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [index]: { ...prev[index], [key]: error },
        }));
    };

    /** ✅ Validate All Fields Before Submit (if needed externally) */
    const validateAll = (): boolean => {
        let allValid = true;
        const newErrors: any = {};

        materials.forEach((m, i) => {
            const rowErrors: any = {};

            if (!m.description.trim()) rowErrors.description = "Description is required.";
            if (m.orderedQty <= 0 || isNaN(m.orderedQty))
                rowErrors.orderedQty = "Quantity must be greater than 0.";
            if (!m.unit.trim()) rowErrors.unit = "Unit is required.";
            if (!m.returnable.trim()) rowErrors.returnable = "Select Yes or No.";
            if (!m.photo) rowErrors.photo = "Photo is required.";

            if (Object.keys(rowErrors).length > 0) {
                newErrors[i] = rowErrors;
                allValid = false;
            }
        });

        setErrors(newErrors);
        return allValid;
    };

    /** ✅ Update Material */
    function updateMaterial<K extends keyof Material>(index: number, key: K, value: Material[K]) {
        const updated = [...materials];
        updated[index] = { ...updated[index], [key]: value } as Material;
        setMaterials(updated);
        validateField(index, key, value);
    }

    /** ✅ Delete Material Row */
    const deleteRow = (index: number) => {
        setMaterials((prev) => prev.filter((_, i) => i !== index));
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
    };

    /** ✅ Handle File Upload */
    const handleUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = event.target?.result as string;
            updateMaterial(index, "photo", img);
            validateField(index, "photo", img);   // <-- MANDATORY VALIDATION
        };
        reader.readAsDataURL(file);
    };


    /** ✅ Camera Control */
    const startCamera = async (index: number) => {
        try {
            if (activeCameraIndex !== null && streamRefs.current[activeCameraIndex]) {
                streamRefs.current[activeCameraIndex]?.getTracks().forEach((t) => t.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRefs.current[index] = stream;
            setActiveCameraIndex(index);
        } catch (error) {
            toast.error("Unable to access camera. Please check permissions.");
            console.error("Camera error:", error);
        }
    };

    const stopCamera = () => {
        if (activeCameraIndex !== null && streamRefs.current[activeCameraIndex]) {
            streamRefs.current[activeCameraIndex]?.getTracks().forEach((t) => t.stop());
        }
        setActiveCameraIndex(null);
    };

    const capturePhoto = (index: number) => {
        const video = videoRefs.current[index];
        const canvas = canvasRefs.current[index];
        if (video && canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL("image/png");
            updateMaterial(index, "photo", imageData);
            validateField(index, "photo", imageData);   // <-- MANDATORY VALIDATION
            stopCamera();
        }
    };


    /** ✅ Handle video playback */
    useEffect(() => {
        if (activeCameraIndex === null) return;
        const video = videoRefs.current[activeCameraIndex];
        const stream = streamRefs.current[activeCameraIndex];
        if (video && stream) {
            video.srcObject = stream;
            video.play().catch((err) => console.error("Video play error:", err));
        }
        return () => {
            if (video) video.pause();
        };
    }, [activeCameraIndex]);

    return (
        <section className="mb-2">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-bold text-gray-900">Material Details</h2>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="w-full text-[12px] text-gray-700">
                    <thead className="bg-gray-100">
                        <tr className="font-semibold text-gray-900">
                            <th className="p-2 border text-center w-10">S.No</th>
                            <th className="p-2 border">Description<span className="text-red-500">*</span></th>
                            <th className="p-2 border text-center w-20"> Actual Quantity<span className="text-red-500">*</span></th>
                            <th className="p-2 border text-center w-20"> Returned Quantity<span className="text-red-500">*</span></th>
                            <th className="p-2 border text-center w-20">Unit<span className="text-red-500">*</span></th>
                            <th className="p-2 border text-center w-24">Remarks<span className="text-red-500">*</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map((m, i) => (
                            <tr key={m.id} className="hover:bg-gray-50 align-top">
                                <td className="p-2 border text-center">{i + 1}</td>
                                <td className="p-2 border">
                                    <input
                                        type="text"
                                        value={m.description}
                                        readOnly
                                        className="w-full border rounded px-1.5 py-1 text-[11.5px] bg-gray-100 cursor-not-allowed"
                                    />
                                </td>

                                {/* Actual Quantity (READ ONLY) */}
                                <td className="p-2 border">
                                    <input
                                        type="number"
                                        value={m.orderedQty}
                                        readOnly
                                        className="w-full border rounded px-1.5 py-1 text-[11.5px] bg-gray-100 cursor-not-allowed appearance-auto"
                                    />
                                </td>

                                {/* RETURNED QUANTITY (ONLY EDITABLE FIELD) */}
                                <td className="p-2 border">
                                    <input
                                        type="number"
                                        value={m.returnQty}
                                        onChange={(e) => updateMaterial(i, "returnQty", +e.target.value)}
                                        onBlur={(e) => validateField(i, "returnQty", +e.target.value)}
                                        className={`w-full border rounded px-1.5 py-1 text-[11.5px] appearance-auto ${errors[i]?.returnQty ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />

                                    {errors[i]?.returnQty && (
                                        <p className="text-red-500 text-[10px] mt-0.5">{errors[i]?.returnQty}</p>
                                    )}
                                </td>

                                {/* Unit (READ ONLY) */}
                                <td className="p-2 border">
                                    <input
                                        type="text"
                                        value={m.unit}
                                        readOnly
                                        className="w-full border rounded px-1.5 py-1 text-[11.5px] bg-gray-100 cursor-not-allowed"
                                    />
                                </td>

                                {/* Remarks (READ ONLY) */}
                                <td className="p-2 border">
                                    <input
                                        type="text"
                                        value={m.remarks || ""}
                                        readOnly
                                        className="w-full border rounded px-1.5 py-1 text-[11.5px] bg-gray-100 cursor-not-allowed"
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ReturnableMaterials;


