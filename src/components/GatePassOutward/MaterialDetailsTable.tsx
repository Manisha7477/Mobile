import React, { useRef, useState, useEffect } from "react";
import { HiTrash } from "react-icons/hi";
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
}
 
interface MaterialDetailsTableProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}
 
const MaterialDetailsTable: React.FC<MaterialDetailsTableProps> = ({
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
 
   const isMobileDevice = () => {
    if (typeof navigator === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
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
        <button
          onClick={addRow}
          className="px-2 py-1 border border-blue-300 rounded text-[11px] text-blue-600 font-semibold hover:bg-blue-50"
        >
          + Add Row
        </button>
      </div>
 
      <div className="overflow-x-auto hide-scrollbar border border-gray-200 rounded-md">
        <table className="w-full text-[12px] text-gray-700">
          <thead className="bg-gray-100">
            <tr className="font-semibold text-gray-900">
              <th className="p-2 border text-center w-10">S.No</th>
              <th className="p-2 border">Description<span className="text-red-500">*</span></th>
              <th className="p-2 border text-center w-20">Qty<span className="text-red-500">*</span></th>
              <th className="p-2 border text-center w-20">Unit<span className="text-red-500">*</span></th>
              <th className="p-2 border text-center w-24">Returnable ?</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border text-center w-24">Goods Photo</th>
              <th className="p-2 border text-center w-12">Action</th>
            </tr>
          </thead>
 
          <tbody>
            {materials.map((m, i) => (
              <tr key={m.id} className="hover:bg-gray-50 align-top">
                <td className="p-2 border text-center">{i + 1}</td>
 
                {/* Description */}
                <td className="p-2 border">
                  <input
                    type="text"
                    placeholder="Enter description"
                    value={m.description}
                    onChange={(e) => updateMaterial(i, "description", e.target.value)}
                    onBlur={(e) => validateField(i, "description", e.target.value)}
                    className={`w-full border rounded px-1.5 py-1 text-[11.5px] ${errors[i]?.description ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors[i]?.description && (
                    <p className="text-red-500 text-[10px] mt-0.5">{errors[i]?.description}</p>
                  )}
                </td>
 
                {/* Quantity */}
                <td className="p-2 border">
                  <input
                    type="number"
                    placeholder="0"
                    value={m.orderedQty}
                    onChange={(e) => updateMaterial(i, "orderedQty", +e.target.value)}
                    onBlur={(e) => validateField(i, "orderedQty", +e.target.value)}
                    className={`w-full border rounded px-1.5 py-1 text-[11.5px] appearance-auto ${errors[i]?.orderedQty ? "border-red-500" : "border-gray-300"
                      }`}
                  />
 
 
                  {errors[i]?.orderedQty && (
                    <p className="text-red-500 text-[10px] mt-0.5">{errors[i]?.orderedQty}</p>
                  )}
                </td>
 
                {/* Unit */}
                <td className="p-2 border">
                  <input
                    type="text"
                    placeholder="eg.Kg"
                    value={m.unit}
                    onChange={(e) => updateMaterial(i, "unit", e.target.value)}
                    onBlur={(e) => validateField(i, "unit", e.target.value)}
                    className={`w-full border rounded px-1.5 py-1 text-[11.5px] ${errors[i]?.unit ? "border-red-500" : "border-gray-300"
                      }`}
                  />
 
 
                  {errors[i]?.unit && (
                    <p className="text-red-500 text-[10px] mt-0.5">{errors[i]?.unit}</p>
                  )}
                </td>
 
                {/* Returnable */}
                <td className="p-2 border text-center">
                  <div className="flex justify-center gap-2 text-[11.5px]">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`return${i}`}
                        value="Yes"
                        checked={m.returnable === "Yes"}
                        onChange={() => updateMaterial(i, "returnable", "Yes")}
                        className="w-3 h-3 accent-blue-600"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={`return${i}`}
                        value="No"
                        checked={m.returnable === "No"}
                        onChange={() => updateMaterial(i, "returnable", "No")}
                        className="w-3 h-3 accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                  {errors[i]?.returnable && (
                    <p className="text-red-500 text-[10px] mt-0.5">{errors[i]?.returnable}</p>
                  )}
                </td>
 
                {/* Remarks */}
                <td className="p-2 border">
                  <input
                    type="text"
                    placeholder="Enter remarks"
                    value={m.remarks || ""}
                    onChange={(e) => updateMaterial(i, "remarks", e.target.value)}
                    className="w-full border rounded px-1.5 py-1 text-[11.5px]"
                  />
 
                </td>
 
                {/* Goods Photo */}
                <td className="p-2 border text-center">
                  {activeCameraIndex === i ? (
                    <div>
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        autoPlay
                        playsInline
                        muted
                        className="w-20 h-16 mx-auto mb-1 rounded bg-black object-cover"
                      />
                      <canvas ref={(el) => (canvasRefs.current[i] = el)} className="hidden" />
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => capturePhoto(i)}
                          className="bg-blue-600 text-white text-[10px] rounded px-2 py-0.5 hover:bg-blue-700"
                        >
                          Capture
                        </button>
                        <button
                          onClick={stopCamera}
                          className="bg-red-600 text-white text-[10px] rounded px-2 py-0.5 hover:bg-red-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
               
 
                    <div className="flex flex-col items-center">
 
                      {/* If photo exists → show preview */}
                 
 
                      {m.photo ? (
                        <>
                          <img
                            src={m.photo}
                            className="w-16 h-16 rounded border object-cover"
                          />
                          <button
                            onClick={() => updateMaterial(i, "photo", "")}
                            className="text-red-600 text-[10px] mt-1 underline"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() =>
                              isMobileDevice()
                                ? fileRefs.current[i]?.click()
                                : startCamera(i)
                            }
                            className="w-14 h-14 border border-dashed rounded flex items-center justify-center cursor-pointer text-gray-600"
                          >
                            📸
                          </div>
 
                          <input
                            ref={(el) => (fileRefs.current[i] = el)}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
 
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                updateMaterial(i, "photo", event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </>
                      )}
 
                    </div>
                  )}
                </td>
                {/* Action */}
                <td className="p-2 border text-center">
                  <button
                    onClick={() => deleteRow(i)}
                    className="text-red-600 hover:text-red-700 text-xl"
                    title="Delete Row"
                  >
                    <HiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
 
export default MaterialDetailsTable;
 