import React, { useEffect, useRef, useState } from "react";
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
  photo?: string; // <-- important
}
 
interface MaterialDetailsTableProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}
 
const InwardMaterialInfo: React.FC<MaterialDetailsTableProps> = ({
  materials,
  setMaterials,
}) => {
  const [errors, setErrors] = useState<{
    [index: number]: Partial<Record<keyof Material, string>>;
  }>({});
 
  // Camera related states
  const [activeCameraIndex, setActiveCameraIndex] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
  const streamRefs = useRef<{ [key: number]: MediaStream | null }>({});
  const fileRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
 
  /** Add New Material Row */
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
 
  /** Validate Material Fields */
  const validateField = (index: number, key: keyof Material, value: any) => {
    let error = "";
 
    switch (key) {
      case "description":
        if (!value.trim()) error = "Description is required.";
        break;
 
      case "orderedQty":
        if (value <= 0) error = "Ordered quantity must be greater than 0.";
        else if (value < materials[index].receivedQty)
          error = "Ordered quantity cannot be less than received quantity.";
        break;
 
      case "receivedQty":
        if (value < 0) error = "Received quantity cannot be negative.";
        else if (value > materials[index].orderedQty)
          error = "Received qty cannot be more than ordered qty.";
        break;
 
 
 
      default:
        break;
    }
 
    setErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [key]: error },
    }));
  };
 
 
  /** Update Material State */
  function updateMaterial<K extends keyof Material>(index: number, key: K, value: Material[K]) {
    const updated = [...materials];
    updated[index] = { ...updated[index], [key]: value };
    setMaterials(updated);
    validateField(index, key, value);
  }
 
  /** Start Camera */
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
 
  /** Stop Camera */
  const stopCamera = () => {
    if (activeCameraIndex !== null && streamRefs.current[activeCameraIndex]) {
      streamRefs.current[activeCameraIndex]?.getTracks().forEach((t) => t.stop());
    }
    setActiveCameraIndex(null);
  };
 
  /** Capture Photo */
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
       
      stopCamera();
    }
  };
 
 
 
  const isMobileDevice = () => {
    if (typeof navigator === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };
 
  /** Show video when camera starts */
  useEffect(() => {
    if (activeCameraIndex === null) return;
 
    const video = videoRefs.current[activeCameraIndex];
    const stream = streamRefs.current[activeCameraIndex];
 
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch((err) => console.error("Video play error:", err));
    }
 
    return () => video?.pause();
  }, [activeCameraIndex]);
 
  /** Delete Material Row */
  const deleteRow = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };
 
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold text-gray-900">Material Details</h2>
 
        <button
          onClick={addRow}
          className="px-3 py-1.5 border border-blue-300 rounded text-[11px] text-blue-600 font-semibold hover:bg-blue-50 transition"
        >
          + Add Row
        </button>
      </div>
 
      <div className="overflow-x-auto hide-scrollbar border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-[12px] text-gray-700">
          <thead className="bg-blue-50 border-b border-gray-300">
            <tr className="font-semibold text-gray-800">
              <th className="p-3 border-r text-center w-12">S.No</th>
              <th className="p-3 border-r">Description <span className="text-red-500">*</span></th>
              <th className="p-3 border-r text-center w-24">Ordered Qty <span className="text-red-500">*</span></th>
              <th className="p-3 border-r text-center w-24">Received Qty <span className="text-red-500">*</span></th>
              <th className="p-3 border-r text-center w-20">Unit </th>
              <th className="p-3 border-r">Remarks</th>
              <th className="p-3 border-r text-center w-24">Goods Photo</th>
              <th className="p-3 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, i) => (
              <tr key={m.id} className="hover:bg-gray-50 border-b align-top">
                <td className="p-3 border-r text-center">{i + 1}</td>
                {/* Description */}
                <td className="p-3 border-r">
                  <input
                    type="text"
                    placeholder="Enter material description"
                    value={m.description}
                    onChange={(e) => updateMaterial(i, "description", e.target.value)}
                    onBlur={(e) => validateField(i, "description", e.target.value)}
                    className={`w-full border rounded px-2 py-1.5 ${errors[i]?.description ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors[i]?.description && (
                    <p className="text-red-500 text-[10px] mt-1">{errors[i].description}</p>
                  )}
                </td>
                {/* Ordered Qty */}
                <td className="p-3 border-r">
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    value={m.orderedQty}
                    onChange={(e) => updateMaterial(i, "orderedQty", +e.target.value)}
                    onBlur={(e) => validateField(i, "orderedQty", +e.target.value)}
                    className={`w-full border rounded px-2 py-1.5 text-center ${errors[i]?.orderedQty ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors[i]?.orderedQty && (
                    <p className="text-red-500 text-[10px] mt-1">{errors[i].orderedQty}</p>
                  )}
                </td>
 
                {/* Received Qty */}
                <td className="p-3 border-r">
                  <input
                    type="number"
                    placeholder="e.g., 8"
                    value={m.receivedQty}
                    onChange={(e) => updateMaterial(i, "receivedQty", +e.target.value)}
                    onBlur={(e) => validateField(i, "receivedQty", +e.target.value)}
                    className={`w-full border rounded px-2 py-1.5 text-center ${errors[i]?.receivedQty ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors[i]?.receivedQty && (
                    <p className="text-red-500 text-[10px] mt-1">{errors[i].receivedQty}</p>
                  )}
 
                </td>
 
                {/* Unit */}
                <td className="p-3 border-r">
                  <input
                    type="text"
                    placeholder="eg.kg"
                    value={m.unit}
                    onChange={(e) => updateMaterial(i, "unit", e.target.value)}
                    onBlur={(e) => validateField(i, "unit", e.target.value)}
                    className={`w-full border rounded px-2 py-1.5 ${errors[i]?.unit ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors[i]?.unit && (
                    <p className="text-red-500 text-[10px] mt-1">{errors[i].unit}</p>
                  )}
 
                </td>
 
                {/* Remarks */}
                <td className="p-3 border-r">
                  <input
                    type="text"
                    value={m.remarks || ""}
                    onChange={(e) => updateMaterial(i, "remarks", e.target.value)}
                    className="w-full border rounded px-2 py-1.5"
                  />
                </td>
 
 
                {/* Goods Photo Column */}
                <td className="p-3 border-r text-center">
 
                  {/* When camera is active */}
                  {activeCameraIndex === i ? (
                    <div>
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        autoPlay
                        playsInline
                        muted
                        className="w-20 h-20 bg-black rounded mb-1"
                      />
 
                      <canvas ref={(el) => (canvasRefs.current[i] = el)} className="hidden" />
 
                      <div className="flex gap-1 justify-center mt-1">
                        <button
                          onClick={() => capturePhoto(i)}
                          className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded"
                        >
                          Capture
                        </button>
 
                        <button
                          onClick={stopCamera}
                          className="bg-red-600 text-white text-[10px] px-2 py-1 rounded"
                        >
                          Cancel
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
                {/* Delete Row */}
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
 
export default InwardMaterialInfo;
