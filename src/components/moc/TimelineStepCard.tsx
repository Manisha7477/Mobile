import React from "react";
import { CheckCircle, Clock } from "lucide-react";

interface TimelineStepProps {
  title: string;
  person: string;
  comment?: string;
  date?: string | null;
  active?: boolean;
  completed?: boolean;
}

const TimelineStepCard: React.FC<TimelineStepProps> = ({
  title,
  person,
  comment,
  date,
  active,
  completed,
}) => {
  const Icon = completed ? CheckCircle : Clock;

  return (
    <div className="flex items-start justify-between border-b last:border-0 pb-5">
      <div className="flex items-start gap-3">
        <Icon
          className={`h-5 w-5 mt-1 ${
            completed
              ? "text-blue-600"
              : active
              ? "text-gray-500"
              : "text-gray-300"
          }`}
        />
        <div>
          <p
            className={`font-medium ${
              completed
                ? "text-gray-800"
                : active
                ? "text-gray-700"
                : "text-gray-400"
            }`}
          >
            {title}
          </p>
          <p className="text-sm text-gray-500">{person}</p>
          {comment && <p className="text-sm text-gray-400">{comment}</p>}
        </div>
      </div>
      {date && (
        <p className="text-sm text-gray-400 whitespace-nowrap">
          {date || ""}
        </p>
      )}
    </div>
  );
};

export default TimelineStepCard;