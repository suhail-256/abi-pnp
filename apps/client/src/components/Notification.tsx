import { useEffect, useState } from 'react';
import { useNotifications, useNotificationActions } from '../stores/useNotifications';
import { NotificationType } from '../types';

const notificationIcon = {
  success: '✓',
  error: '!',
  info: 'i',
};

function Notification() {
  const notifications = useNotifications();
  const { removeNotification } = useNotificationActions();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(n => (
        <NotificationItem key={n.id} n={n} removeNotification={removeNotification} />
      ))}
    </div>
  );
}

interface NotificationitemProps {
  n: NotificationType;
  removeNotification: (id: string) => void;
}

function NotificationItem({ n, removeNotification }: NotificationitemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger the slide-up exit animation after 4.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4500);

    // Remove the notification from the state 0.5s later (after animation finishes)
    const removeTimer = setTimeout(() => {
      removeNotification(n.id);
    }, 5000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [n.id, removeNotification]);

  return (
    <div className={`${n.type} ${isExiting ? 'animate-exit' : 'animate-enter'}`}>
      <span className={`${n.type}-alert-icon`} aria-hidden="true">
        {notificationIcon[n.type]}
      </span>
      <span>{n.msg}</span>
    </div>
  );
}

export default Notification;
