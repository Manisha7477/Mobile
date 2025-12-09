import React, { useState, useEffect } from 'react';
import NotificationTopHeader from '../Notifications/NotificationTopHeader';
import SearchFilter from '../Notifications/SearchFilter';
import NotificationCards from '../Notifications/NotificationCards';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axiosInstance';
import { toast } from 'react-toastify';
 
interface Notification {
  id: number;
  type: string;
  module_name: string;
  title: string;
  description: string;
  requestNumber: string;
  timestamp: string;
  status: string;
  created_by?: string;
  requestorNo?: string;
  date?: string;
}
 
const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
 
  // Map backend module names (or keys) to the dropdown labels used in SearchFilter.
  const mapModuleLabel = (raw: string | undefined): string => {
    if (!raw) return " ";
    const r = raw.toLowerCase();
    if (r.includes('moc') || r.includes('management of changes') || r.includes('change')) return "Management Of Changes";
    if (r.includes('leave')) return "Leave Management";
    if (r.includes('gate') || r.includes('gatepass')) return "Gate Pass Management";
    if (r.includes('travel')) return "Travel Management";
    if (r.includes('claim')) return "Claim Management";
    if (r.includes('digital') || r.includes('logbook')) return "Digital LogBook";
    if (r.includes('hse')) return "HSE Incident Reporting";
    if (r.includes('permit')) return "Permit Management";
    if (r.includes('employee')) return "Employee Personal Updates";
    if (r.includes('hr') || r.includes('hraction')) return "HR Action Tracker Employer";
    if (r.includes('circular')) return "Circular Management";
    if (r.includes('training')) return "Training Planner";
    // fallback: return raw with capitalization trimmed
    return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };
 
  const extractRequestNumber = (desc: string) => {
    const match = desc.match(/Moc\/[A-Za-z]+\/\d{4}-\d{2}\/\d{3}/i);
    return match ? match[0] : 'Unknown';
  };
  const handleNavigation = (item: any) => {
    switch (item.type?.toLowerCase()) {
      case "review":
        navigate(
          `/station-operations/moc/HiraReview/${encodeURIComponent(
            item.requestNumber
          )}`,
          { state: item }
        );
        break;
 
      case "approval":
        navigate(`/moc/approval/${item.requestNumber}`, { state: item });
        break;
 
      case "gatepass":
        navigate(`/station-operations/gate-pass/default`);
        break;
 
      default:
        console.warn("Unknown notification type:", item.type);
    }
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('userData');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const username = parsedUser?.username;
 
        const res = await api.get(`/notifications/user/${encodeURIComponent(username)}`);
 
        if (Array.isArray(res.data)) {
          const mapped: Notification[] = res.data.map((item: any): Notification => ({
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            requestNumber: extractRequestNumber(item.description),
            timestamp: item.date,
            status: item.type,
            created_by: item.from_user,
            requestorNo: item.to_user,
            date: item.date,
            module_name: mapModuleLabel(item.module_name || item.module || item.app) // normalized label
          }));
 
          setNotifications(mapped);
         toast.success("Fetching new Notification")
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
 
  const filteredNotifications = notifications.filter((n) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesModule = selectedModule
      ? (n.module_name || '').toLowerCase().includes(selectedModule.toLowerCase())
      : true;
 
    const matchesSearch = q
      ? (
          (n.title || '').toLowerCase().includes(q) ||
          (n.description || '').toLowerCase().includes(q) ||
          (n.requestNumber || '').toLowerCase().includes(q)
        )
      : true;
 
    return matchesModule && matchesSearch;
  });
 
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <div className="rounded-md mb-1">
        <NotificationTopHeader title="Notifications" subTitle="Stay updated with all your MoC activities" />
      </div>
 
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedModule={selectedModule}
        onModuleChange={setSelectedModule}
      />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', marginBottom: '20px' }}>
        <div className="max-w-6xl mx-auto p-2">
          <NotificationCards
            notifications={filteredNotifications} // ✔ show all
            loading={loading}
            onNavigate={handleNavigation}
          />
        </div>
      </div>
 
      {/* Close Button */}
      <div style={{
        position: 'fixed',
        bottom: 'clamp(12px, 3vw, 20px)',
        right: 'clamp(12px, 3vw, 20px)',
        zIndex: 50
      }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-md -mb-3 mr-5 font-semibold text-white transition-all shadow-lg"
          style={{
            backgroundColor: '#2563eb',
            height: '44px',
            minWidth: '120px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
 
export default NotificationsPage;