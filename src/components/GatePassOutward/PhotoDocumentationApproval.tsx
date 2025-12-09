import React, { useRef, useState, useEffect } from "react";

interface PhotoDocumentationProps {
  onPhotosChange?: (photos: (string | null)[]) => void;
  initialPhotos?: {
    vehicle_photo?: string;
    delivery_personnel_photo?: string;
    delivery_personnel_id_photo?: string;
    goods_photo?: string;
  };
}

const PhotoDocumentationApproval: React.FC<PhotoDocumentationProps> = ({
  onPhotosChange,
  initialPhotos
}) => {

  const [photos, setPhotos] = useState<{ [key: number]: string }>({});
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

  /** Load initial photos from parent */
  useEffect(() => {
    if (!initialPhotos) return;

    console.log("📥 Received photos in PhotoDocumentation:", initialPhotos);

    setPhotos({
      0: initialPhotos.vehicle_photo || "",
      1: initialPhotos.delivery_personnel_photo || "",
      2: initialPhotos.delivery_personnel_id_photo || "",
      3: initialPhotos.goods_photo || "",
    });
  }, [initialPhotos]);

  const handleUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotos((prev) => ({ ...prev, [index]: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async (index: number) => {
    if (initialPhotos) return; // disable editing in VIEW mode

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRefs.current[index] = stream;
      setActiveCameraIndex(index);
    } catch {
      alert("Unable to access camera.");
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
      const img = canvas.toDataURL("image/png");
      setPhotos((prev) => ({ ...prev, [index]: img }));
      stopCamera();
    }
  };

  useEffect(() => {
    if (!onPhotosChange) return;

    onPhotosChange([
      photos[0] || null,
      photos[1] || null,
      photos[2] || null,
      photos[3] || null,
    ]);
  }, [photos]);

  return (
    <section className="mb-3">
      <h2 className="text-sm font-bold text-gray-900 mb-3">Photo Documentation</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {labels.map((label, i) => (
          <div key={i} className="border rounded-md p-3">

            <p className="text-xs font-semibold mb-2">{label}</p>

            {initialPhotos ? (
              photos[i] ? (
                <img
                  src={photos[i]}
                  className="w-full h-24 object-cover border rounded"
                  alt="Photo Preview"
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center
                    border border-gray-300 rounded text-gray-500 text-xs">
                  Photo not present
                </div>
              )
            ) : (
              <>
                {/* Upload / Camera for CREATE mode */}
                {activeCameraIndex === i ? (
                  <div>
                    <video
                      ref={(el) => (videoRefs.current[i] = el)}
                      autoPlay
                      className="w-full h-24 object-cover bg-black rounded"
                    />
                    <canvas ref={(el) => (canvasRefs.current[i] = el)} className="hidden" />

                    <button
                      onClick={() => capturePhoto(i)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs mt-2"
                    >
                      Capture
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs ml-2"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      onClick={() => startCamera(i)}
                      className="w-full h-24 border border-dashed bg-gray-50 flex items-center justify-center rounded cursor-pointer text-xl"
                    >
                      📷
                    </div>

                    <input
                      ref={(el) => (fileRefs.current[i] = el)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(i, e)}
                    />
                  </div>
                )}

                {photos[i] && (
                  <img
                    src={photos[i]}
                    className="w-full h-24 mt-2 object-cover border rounded"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoDocumentationApproval;
//Photo Documenattion 
