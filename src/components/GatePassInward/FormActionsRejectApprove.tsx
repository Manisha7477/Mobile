import React from "react";
import { X, CheckCircle, FileText, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface FormActionsPhotoApprovalProps {
  onCancel: () => void;
  onPrintPreview: () => void;
  onReject: () => void;
  onApprove: () => void;
  inward_id: string;
}




const FormActionsForRejectApprove: React.FC<FormActionsPhotoApprovalProps> = ({
  onCancel,
  onPrintPreview,
  onReject,
  onApprove,
  inward_id,
}) => {

  const navigate = useNavigate();

  return (
    <div className="border-t py-3 flex justify-end items-center gap-3 bg-white">
      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="flex items-center justify-center gap-1.5 px-3 py-2 border rounded-md
                 text-gray-700 font-medium text-xs sm:text-sm hover:bg-gray-100 transition w-full sm:w-auto"
      >
        <X size={14} />
        Cancel
      </button>

      {/* Print Preview Button */}
      <button
        onClick={() =>
          navigate(`/station-operations/gate-pass/inward/preview/${inward_id}`)
        }
        className="flex items-center justify-center gap-1.5 px-3 py-2 border rounded-md
                 text-gray-700 font-medium text-xs sm:text-sm hover:bg-gray-100 transition w-full sm:w-auto"
      >
        <Printer size={14} />
        Print Preview
      </button>

      {/* Reject Button */}
      <button
        onClick={onReject}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition"
      >
        <X size={14} className="text-white" />
        Reject
      </button>

      {/* Approve Button */}
      <button
        onClick={onApprove}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
      >
        <CheckCircle size={14} className="text-white" />
        Approve
      </button>
    </div>
  );
};

export default FormActionsForRejectApprove;