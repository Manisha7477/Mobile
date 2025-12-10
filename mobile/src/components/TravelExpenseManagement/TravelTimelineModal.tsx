import React from "react";
import { X, Check, Download } from "lucide-react";
import { statusColors } from "../tables/TravelBasicTable";
 
interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}
 
const TravelTimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;
 
  const dummyTimeline = [
    {
      department: "Supervisor",
      person: "Sarah Supervisor",
      date: "2024-02-24",
    },
    {
      department: "HR",
      person: "Mike HR",
      date: "2024-02-25",
    },
    {
      department: "Finance",
      person: "Linda Finance",
      date: "2024-02-26",
    },
  ];
 
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[600px] max-h-[90vh] rounded-xl p-4 shadow-xl overflow-                               y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {data.type} - ({data.claim_id})
          </h2>
          <div className="flex items-center gap-2">
          <button
            onClick={() => console.log("Download clicked")}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-sm
              hover:bg-blue-700 hover:shadow-md transition-all duration-200 text-xs "
          >
            <Download size={16} className="stroke-[2]" />
            <span>Download</span>
          </button>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        </div>
 
        {/* TOP ROW */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p >Employee</p>
            <p className="font-semibold">{data.employee}</p>
          </div>
 
          <div>
            <p >Employee No</p>
            <p className="font-semibold">123456</p>
          </div>
 
          <div>
            <p >Submitted Date</p>
            <p className="font-semibold">{data.submitted_date}</p>
          </div>
 
          <div>
            <p >Status</p>
            <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
                statusColors[data.status] || "bg-gray-100 text-gray-600"
            }`}
            >
            {data.status}
            </span>
          </div>
        <div >
          <p >Claim Details</p>
          <p className=" font-semibold mt-1">{data.purpose}</p>
        </div>
        <div >
          <p >Amount Disbursement</p>
          <div className="flex items-center font-semibold gap-2 mt-1">
            {data.amount_disbursed ? (
              <span className="text-green-700 bg-green-100 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <Check className="w-4 h-4" /> Disbursed
              </span>
            ) : (
              <span className="text-gray-600 text-sm">Not Disbursed</span>
            )}
          </div>
        </div>
        </div>
 
 
        {/* TOTAL AMOUNT */}
        <div className="mt-2 border rounded-lg px-4 py-1 bg-gray-50 flex justify-between items-center">
          <span className="font-semibold">Total Amount</span>
          <span className="text-lg font-bold">{data.amount}</span>
        </div>
 
        {/* TIMELINE */}
        <div className="mt-2">
          <p className="font-semibold mb-3">Approval Timeline</p>
 
          {dummyTimeline.map((t, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                {index !== dummyTimeline.length - 1 && (
                  <div className="w-1 bg-green-300 h-8"></div>
                )}
              </div>
 
              <div>
                <p className="font-semibold">{t.department}</p>
                <p className="text-gray-600 text-sm">Approved by {t.person}</p>
                <p className="text-gray-500 text-xs">{t.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default TravelTimelineModal;