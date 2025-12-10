import { FileText, Clock, Undo2, XCircle } from "lucide-react";
 
function ApproverDashboardTopCard() {
  const cards = [
    { name: "Total Requests", value: 24, icon: FileText, color: "text-blue-600" },
    { name: "Pending Review", value: 5, icon: Clock, color: "text-orange-500" },
    { name: "Sent back for Changes", value: 1, icon: Undo2, color: "text-gray-700" },
    { name: "Rejected", value: 3, icon: XCircle, color: "text-red-500" },
  ];
 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-4 border hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-1">
              <h6 className="text-sm font-semibold text-gray-600">{c.name}</h6>
              <Icon className={`h-6 w-6 ${c.color}`} />
            </div>
 
            <div className="text-3xl font-bold text-gray-800 mt-1">{c.value}</div>
          </div>
        );
      })}
    </div>
  );
}
 
export default ApproverDashboardTopCard;