import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
 
import { X } from "lucide-react";
 
const MouseSignature: React.FC<{
  thumbnailBase64?: string | null;
  onSave?: (b64: string | null) => void;
}> = ({ thumbnailBase64 = null, onSave }) => {
  const sigRef = useRef<SignaturePad | null>(null);
  const [open, setOpen] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(thumbnailBase64 || null);
 
  // Sync external value to local preview
React.useEffect(() => {
  if (thumbnailBase64) {
    setLocalPreview(thumbnailBase64);
  }
}, [thumbnailBase64]);
 
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
 
  const clearPad = () => {
    sigRef.current?.clear();
  };
 
  const saveSignature = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.toDataURL("image/png");
      setLocalPreview(dataUrl);
      if (onSave) onSave(dataUrl);
    } else {
      // if empty, treat as clearing signature
      setLocalPreview(null);
      if (onSave) onSave(null);
    }
    closeModal();
  };
 
  return (
    <div>
      {/* small thumbnail box */}
      <div className="flex items-center gap-3">
        <div
          className="w-28 h-20 border rounded-sm flex items-center justify-center bg-white cursor-pointer"
          onClick={openModal}
          title="Click to sign"
        >
          {localPreview ? (
            <img src={localPreview} alt="signature" className="w-full h-full object-contain" />
          ) : (
            <div className="text-xs text-gray-500">Mouse Signature</div>
          )}
        </div>
 
        <div>
          <button onClick={openModal} className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm">
            Sign
          </button>
        </div>
      </div>
 
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Draw signature (Mouse / Touch)</h3>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
                <X />
              </button>
            </div>
 
            <div className="border rounded">
              <SignaturePad
                ref={sigRef}
                canvasProps={{ className: "w-full", style: { height: 260 } }}
                penColor="black"
              />
            </div>
 
            <div className="flex justify-between items-center mt-3">
              <button onClick={() => { sigRef.current?.clear(); }} className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200">
                Clear
              </button>
 
              <div className="flex gap-3">
                <button onClick={closeModal} className="px-4 py-2 border rounded hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={saveSignature}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default MouseSignature;