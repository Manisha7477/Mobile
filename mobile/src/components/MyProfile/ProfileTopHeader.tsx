import api from '@/api/axiosInstance'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface MocHeaderProps {
  title: string
  subTitle?: string
  onAddClick?: () => void
}

const ProfileTopHeader: React.FC<MocHeaderProps> = ({
  title,
  subTitle,
  onAddClick,

}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // ✅ Get username dynamically from localStorage (fallback: 'kiran')
        const storedUser = localStorage.getItem('userData');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const username = parsedUser?.username;

        const res = await api.get(`/notifications/user/${encodeURIComponent(username)}`)

        if (res.data && Array.isArray(res.data)) {
          setNotifications(res.data);
          // setTimeout(() => {toast.success("Fetching new Notification")},1000);
        }
      } catch (error) {
        console.error('🚨 Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div
      className="relative bg-[#1E6FBF] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-3 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 rounded-md shadow-md w-full"
    >
      <div className="flex-1 min-w-0">
        <h1 className="text-white text-xs sm:text-sm md:text-lg lg:text-2xl font-semibold">
          {title}
          {subTitle && (
            <span
              className="
        block          /* Always new line on ALL screens */
        text-[10px] sm:text-xs md:text-xs
        font-normal
        text-gray-200
      "
            >
              {subTitle}
            </span>
          )}
        </h1>
      </div>
      {onAddClick && (
       <button
  className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md 
             bg-white px-2 py-1 text-xs sm:text-sm md:text-base 
             font-medium text-blue-600 shadow-sm transition 
             hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white 
             focus:ring-offset-2 focus:ring-offset-blue-600 flex-shrink-0"
  onClick={onAddClick}
>
  Asset Submitted
</button>

      )}
    </div>
  )
}

export default ProfileTopHeader