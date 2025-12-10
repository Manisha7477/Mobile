import React from "react";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

interface GatePassCardProps {
  type: "inward" | "outward";
  title: string;
  description: string;
  onCreate: () => void;
  className?: string;
}

const GatePassCard: React.FC<GatePassCardProps> = ({
  type,
  title,
  description,
  onCreate,
}) => {
  const icon =
    type === "inward" ? (
      <LogIn className="text-gray-600" size={20} />
    ) : (
      <LogOut className="text-gray-600" size={20} />
    );

  return (
    <div className="min-w-[280px] sm:min-w-[320px] md:flex-1 bg-blue-20 border border-gray-200 rounded-xl shadow-sm p-3 flex flex-col justify-between hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-gray-900 font-semibold text-base sm:text-lg">{title}</h2>
          <p className="text-gray-500 text-xs mt-1 leading-snug">{description}</p>
        </div>
        {/* <div className="bg-gray-100 rounded-md p-2">{icon}</div> */}
      </div>
      <button
        onClick={onCreate}
        className="mt-2 w-full border border-gray-300 bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium py-1 rounded-md transition text-sm"
      >
        {type === "inward" ? "Create Inward Pass" : "Create Outward Pass"}
      </button>
    </div>
  );
};

const InwardOutward: React.FC = () => {
  const navigate = useNavigate();

  // Navigation Handlers
  const handleCreateInward = () => {
    navigate("/station-operations/gate-pass/inwardGatepass");
  };

  const handleCreateOutward = () => {
    navigate("/station-operations/gate-pass/create-outward");
  };

  return (
    <div className="w-full flex flex-row gap-2 pl-1 overflow-x-auto hide-scrollbar md:overflow-visible">
      <GatePassCard
        type="inward"
        title="Inward Gate Pass"
        description="Material coming into premises.
        Record materials entering the facility. Track PO/Non-PO
        items and partial deliveries."
        onCreate={handleCreateInward}
      />

      <GatePassCard
        type="outward"
        title="Outward Gate Pass"
        description="Material going out of premises. Create gate pass for materials leaving the facility. Must be approved by Initiator and Reviewer."
        onCreate={handleCreateOutward}
      />
    </div>
  );
};

export default InwardOutward;