import React from "react";
import { X, CheckCircle, FileText, Printer } from "lucide-react";
 
interface FormActionsPhotoApprovalProps {
  onCancel: () => void;
  onPrintPreview: () => void;
  onReject: () => void;
  onApprove: () => void;
}
 
const FormActionsForRejectApprove: React.FC<FormActionsPhotoApprovalProps> = ({
  onCancel,
  onPrintPreview,
  onReject,
  onApprove,
}) => {
  return (
    <div className="border-t py-3 flex justify-end items-center gap-3 bg-white">
      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 px-4 py-1.5 border rounded-md text-gray-700 font-medium text-sm hover:bg-gray-100 transition"
      >
        <X size={14} />
        Cancel
      </button>
 
      {/* Print Preview Button */}
      <button
        onClick={onPrintPreview}
        className="flex items-center gap-1.5 px-4 py-1.5 border rounded-md text-gray-700 font-medium text-sm hover:bg-gray-100 transition"
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