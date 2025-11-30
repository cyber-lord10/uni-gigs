import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export const ChatService = {
  // Get all communities available for the user (e.g. same university or public)
  getCommunities: async (university) => {
    const q = query(
      collection(db, "communities"),
      where("university", "in", [university, "Global"]),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Subscribe to messages in a community
  subscribeToMessages: (communityId, callback) => {
    const q = query(
      collection(db, "communities", communityId, "messages"),
      orderBy("createdAt", "asc"),
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });
  },

  // Send a message
  sendMessage: async (communityId, user, text, replyTo = null) => {
    await addDoc(collection(db, "communities", communityId, "messages"), {
      text,
      senderId: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      createdAt: serverTimestamp(),
      replyTo, // { id, text, senderName }
    });
  },

  // Create a new community (for demo purposes)
  createCommunity: async (name, description, university) => {
    await addDoc(collection(db, "communities"), {
      name,
      description,
      university,
      createdAt: serverTimestamp(),
    });
  },
};
