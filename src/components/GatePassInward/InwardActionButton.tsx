interface FormActionsProps {
  onCancel: () => void;
 
  onSubmit: () => void;
}
 
const InwardActionButtons: React.FC<FormActionsProps> = ({ onCancel, onSubmit }) => (
  <div className="border-t py-1 flex justify-end items-center gap-2 bg-white">
    <button
      onClick={onCancel}
      className="px-5 py-2 border rounded-md text-gray-700 font-semibold hover:bg-gray-100"
    >
      Cancel
    </button>
 
    <button
      onClick={onSubmit}
      className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
    >
      Send for Approval
    </button>
  </div>
);
 
 
export default InwardActionButtons;
 
