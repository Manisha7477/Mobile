import React from "react";
import { Loader2 } from "lucide-react"; // optional loading spinner icon

interface ReviewButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-1 px-3 py-1 text-xs rounded-md text-white transition-colors duration-200 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" /> Loading...
        </>
      ) : (
        "Review"
      )}
    </button>
  );
};

export default ReviewButton;