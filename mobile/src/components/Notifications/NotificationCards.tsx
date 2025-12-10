import React from "react";
import { ChevronRight } from "lucide-react";
 
interface Notification {
  id: number;
  module_name: string;
  title: string;
  description: string;
  timestamp: string; // “2025-11-10T15:07:40.923255”
}
 
interface NotificationCardsProps {
  notifications: Notification[];
  loading: boolean;
  onNavigate: (item: Notification) => void;
}
const moduleColors: Record<string, string> = {
  "Management Of Changes": "#E6194B",
  "Leave Management": "#3CB44B",
  "Gate Pass Management": "#013B5A",
  "Travel Management": "#F58231",
  "Claim Management": "#911EB4",
  "Digital LogBook": "#46F0F0",
  "HSE Incident Reporting": "#FFD700",
  "Permit Management": "#A2C702",
  "Employee Personal Updates": "#008080",
  "HR Action Tracker Employer": "#AA6E28",
  "Circular Management": "#800000",
  "Training Planner": "#808000",
  Default: "#CBD5E0",
};
 
// Convert timestamp → "10 minutes ago"
const timeAgo = (timestamp: string) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
 
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
 
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};
 
const NotificationCards: React.FC<NotificationCardsProps> = ({
  notifications,
  loading,
  onNavigate
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin h-10 w-10 rounded-full border-2 border-b-transparent border-blue-600"></div>
      </div>
    );
  }
 
  if (!notifications.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No notifications found
      </div>
    );
  }
 
  return (
  <div className="space-y-2">
    {notifications.map((item) => {
      const color = moduleColors[item.module_name] || moduleColors.Default;
 
      return (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 flex p-3 items-start"
        >
          {/* Left Color bar */}
          <div className="flex flex-col items-center mr-4 mt-1">
            <div
              className="w-2 h-8 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
          </div>
 
          {/* Main Content */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {item.title}
            </h3>
 
            <p className="text-gray-600 text-sm mt-1">
              {item.description}
            </p>
          </div>
 
          {/* Right Side: Timestamp + CTA */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{timeAgo(item.timestamp)}</span>
 
 
            <button
            onClick={() => onNavigate(item)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md flex items-center gap-2 hover:bg-blue-700 transition">
              View Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);
 
};
 
export default NotificationCards;