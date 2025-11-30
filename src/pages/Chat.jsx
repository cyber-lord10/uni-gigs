import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChatService } from "../services/chat";
import { Send, Reply, X } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Chat() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [community, setCommunity] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchCommunity() {
      const docRef = doc(db, "communities", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCommunity({ id: docSnap.id, ...docSnap.data() });
      }
    }
    fetchCommunity();

    const unsubscribe = ChatService.subscribeToMessages(id, setMessages);
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await ChatService.sendMessage(id, currentUser, newMessage, replyTo);
      setNewMessage("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col card p-0 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-md border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <h2 className="font-bold text-lg">{community?.name || "Loading..."}</h2>
        <p className="text-sm text-muted">{community?.description}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-md space-y-md bg-[var(--color-bg)]">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.uid;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] ${isMe ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-bg-card)] border border-[var(--color-border)]"} rounded-lg p-sm shadow-sm relative group`}
              >
                {/* Reply Context */}
                {msg.replyTo && (
                  <div
                    className={`text-xs mb-xs p-xs rounded ${isMe ? "bg-white/20" : "bg-[var(--color-bg)]"} border-l-2 border-white/50`}
                  >
                    <span className="font-bold block">
                      {msg.replyTo.senderName}
                    </span>
                    <span className="truncate block max-w-[200px]">
                      {msg.replyTo.text}
                    </span>
                  </div>
                )}

                {!isMe && (
                  <div className="text-xs font-bold mb-xs text-[var(--color-accent)]">
                    {msg.senderName}
                  </div>
                )}

                <p className="text-sm">{msg.text}</p>

                <span
                  className={`text-[10px] block mt-xs ${isMe ? "text-white/70" : "text-muted"}`}
                >
                  {msg.createdAt?.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* Reply Button */}
                <button
                  onClick={() => setReplyTo(msg)}
                  className={`absolute top-2 ${isMe ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--color-bg-input)] rounded-full`}
                  title="Reply"
                >
                  <Reply size={16} className="text-muted" />
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-md border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
        {replyTo && (
          <div className="flex justify-between items-center bg-[var(--color-bg)] p-sm rounded mb-sm border-l-4 border-[var(--color-primary)]">
            <div>
              <span className="text-xs text-[var(--color-primary)] font-bold">
                Replying to {replyTo.senderName}
              </span>
              <p className="text-sm text-muted truncate max-w-md">
                {replyTo.text}
              </p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-muted hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex gap-sm">
          <input
            type="text"
            className="input flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary px-md">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
