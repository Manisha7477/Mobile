import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
 
interface PhotoDocumentationProps {
  onPhotosChange: (photos: (string | null)[]) => void;
}
 
const PhotoDocumentation: React.FC<PhotoDocumentationProps> = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState<{ [key: number]: string[] }>({
    0: [],
    1: [],
    2: [],
    3: [],
  });
 
  const [activeCameraIndex, setActiveCameraIndex] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
  const fileRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const streamRefs = useRef<{ [key: number]: MediaStream | null }>({});
 
  const labels = [
    "Vehicle Photo",
    "Delivery Personnel Photo",
    "Delivery Personnel ID Photo",
    "Goods Photo",
  ];
 
  /** 📤 File Upload */
  const handleUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotos((prev) => ({
        ...prev,
        [index]: [...prev[index], event.target?.result as string],
      }));
    };
    reader.readAsDataURL(file);
  };
 
  /** 🎥 Start Camera */
  const startCamera = async (index: number) => {
    try {
      if (activeCameraIndex !== null && streamRefs.current[activeCameraIndex]) {
        streamRefs.current[activeCameraIndex]?.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRefs.current[index] = stream;
      setActiveCameraIndex(index);
    } catch {
      toast.success("Unable to access camera. Please allow camera permission.");
    }
  };
 
  /** 🛑 Stop Camera */
  const stopCamera = () => {
    if (activeCameraIndex !== null && streamRefs.current[activeCameraIndex]) {
      streamRefs.current[activeCameraIndex]?.getTracks().forEach((t) => t.stop());
    }
    setActiveCameraIndex(null);
  };
 
  /** 📸 Capture Photo */
  const capturePhoto = (index: number) => {
    const video = videoRefs.current[index];
    const canvas = canvasRefs.current[index];
 
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
 
      const imageData = canvas.toDataURL("image/png");
 
      setPhotos((prev) => ({
        ...prev,
        [index]: [...prev[index], imageData],
      }));
 
      stopCamera();
    }
  };
 
  /** Update parent with LATEST photo per category */
  useEffect(() => {
    onPhotosChange([
      photos[0]?.[photos[0].length - 1] || null,
      photos[1]?.[photos[1].length - 1] || null,
      photos[2]?.[photos[2].length - 1] || null,
      photos[3]?.[photos[3].length - 1] || null,
    ]);
  }, [photos]);
 
  useEffect(() => {
    if (activeCameraIndex === null) return;
 
    const video = videoRefs.current[activeCameraIndex];
    const stream = streamRefs.current[activeCameraIndex];
 
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(console.error);
    }
 
    return () => video?.pause();
  }, [activeCameraIndex]);
 
  const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);
 
  /** 🗑 Delete a specific photo */
  const deletePhoto = (section: number, index: number) => {
    setPhotos((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };
 
 return (
    <section className="mb-3">
      <h2 className="text-sm font-bold text-gray-900 mb-1">Photo Documentation</h2>
      <div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-4 pb-2 scrollbar-thin">
        {labels.map((label, sectionIndex) => (
          <div
            key={sectionIndex}
            className="border p-3 rounded-md bg-white shadow-sm min-w-[300px] flex-shrink-0"
          >
            <p className="text-xs font-semibold text-gray-700 mb-2">{label}</p>
            {/* CAMERA ACTIVE */}
            {activeCameraIndex === sectionIndex ? (
              <div>
                <video
                  ref={(el) => (videoRefs.current[sectionIndex] = el)}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-24 bg-black rounded-md mb-2"
                />
                <canvas
                  ref={(el) => (canvasRefs.current[sectionIndex] = el)}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => capturePhoto(sectionIndex)}
                    className="flex-1 bg-blue-600 text-white text-xs py-1 rounded"
                  >
                    📸 Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-red-600 text-white text-xs py-1 rounded"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <div className="border border-dashed w-12 h-12 rounded-md flex items-center justify-center cursor-pointer text-xl text-gray-500">
                  📷
                </div>
                <button
                  onClick={() =>
                    isMobileDevice()
                      ? fileRefs.current[sectionIndex]?.click()
                      : startCamera(sectionIndex)
                  }
                  className="flex-1 border px-2 py-1 rounded text-xs"
                >
                  Click Picture
                </button>
                <input
                  ref={(el) => (fileRefs.current[sectionIndex] = el)}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleUpload(sectionIndex, e)}
                />
              </div>
            )}
            {photos[sectionIndex]?.length > 0 && (
              <div className="mt-2 max-h-28 overflow-y-auto space-y-2">
                {photos[sectionIndex].map((photo, i) => (
                  <div key={i} className="relative">
                    <img
                      src={photo}
                      className="w-full h-20 object-cover rounded-md border"
                    />
                    <button
                      onClick={() => deletePhoto(sectionIndex, i)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
 
export default PhotoDocumentation;
 
 
 