import { Plus } from "lucide-react";
 
interface TETopHeaderProps {
    title: string;
    subTitle?: string;
 
    // For showing ALL 3 buttons (like your screenshot)
    showButtons?: boolean;
 
    onTravelRequisitionClick?: () => void;
    onMealAllowanceClick?: () => void;
    onDailyAllowanceClick?: () => void;
}
 
const TETopHeader: React.FC<TETopHeaderProps> = ({
    title,
    subTitle,
    showButtons,
    onTravelRequisitionClick,
    onMealAllowanceClick,
    onDailyAllowanceClick,
}) => {
    return (
        <div className="relative bg-[#1E6FBF] px-4 py-3 flex items-center justify-between rounded-md shadow-md w-full">
           
            {/* LEFT – Title */}
            <div className="flex-1 min-w-0">
                <h1 className="text-white text-lg font-semibold">{title}</h1>
                {subTitle && (
                    <span className="text-xs text-gray-200 block">{subTitle}</span>
                )}
            </div>
 
            {/* RIGHT – 3 Buttons */}
            {showButtons && (
                <div className="flex items-center gap-2">
 
                    <button
                        onClick={onTravelRequisitionClick}
                        className="btn-white"
                    >
                        <Plus size={16} /> Travel Requisition
                    </button>
 
                    <button
                        onClick={onMealAllowanceClick}
                        className="btn-white"
                    >
                        <Plus size={16} /> Meal Allowance
                    </button>
 
                    <button
                        onClick={onDailyAllowanceClick}
                        className="btn-white"
                    >
                        <Plus size={16} /> Daily Allowance
                    </button>
 
                </div>
            )}
        </div>
    );
};
 
export default TETopHeader;