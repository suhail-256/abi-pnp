import { useNavigate } from 'react-router-dom';
import { useNotificationActions } from '../stores/useNotificationsStore';
import { useEffect } from 'react';

export default function UnkownRoutesHandler() {
  const { pushNotification } = useNotificationActions();
  const navigate = useNavigate();

  useEffect(() => {
    pushNotification({ msg: '404 - Not found', type: 'error' });
    navigate('/');
  }, []);

  return null;
}
