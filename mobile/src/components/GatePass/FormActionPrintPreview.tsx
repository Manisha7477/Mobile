import React from "react";
import { X, CheckCircle, FileText, Printer } from "lucide-react";
 
interface FormActionsPhotoApprovalProps {
  onCancel: () => void;
  onPrintPreview: () => void;
 
}
 
const FormActionPrintPreview: React.FC<FormActionsPhotoApprovalProps> = ({
  onCancel,
  onPrintPreview,
 
 
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
 
   
   
    </div>
  );
};
 
export default FormActionPrintPreview;
