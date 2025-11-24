import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';
import { useState, useEffect } from 'react';

const messaging = getMessaging();

export async function createNotification(userId, title, message, type = 'info', link = null) {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

export const NotificationService = {
  requestPermission: async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { 
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
        });
        return token;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
    return null;
  },

  saveToken: async (userId, token) => {
    if (!token) return;
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      fcmToken: token
    });
  }
};

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to notifications:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, markAsRead, unreadCount };
}
