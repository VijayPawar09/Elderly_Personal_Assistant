import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Send, Circle } from "lucide-react";
import { getProfilePhotoUrl, handleImageError } from "../../utils/imageUtils.js";

const ChatPage = () => {
  const { state } = useLocation();
  const assistant = state?.assistant || {
    _id: "assistant1",
    name: "Assistant",
    profilePhoto: null,
    status: "online"
  };

  const user = { _id: "user1", name: "You" };

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const chatRef = useRef(null);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const msg = {
      senderId: user._id,
      receiverId: assistant._id,
      content: newMsg,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, msg]);
    setNewMsg("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b bg-indigo-600 text-white">
        <div className="relative">
          <img
            src={getProfilePhotoUrl(assistant.profilePhoto, assistant.name)}
            alt="Assistant Avatar"
            className="w-12 h-12 rounded-full border-2 border-white/30"
            onError={(e) => handleImageError(e, assistant.name)}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{assistant.name}</h2>
          <p className="text-sm flex items-center">
            <Circle className="w-2 h-2 text-green-400 fill-current mr-1" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === user._id;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-sm lg:max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                isMe 
                  ? "bg-indigo-500 text-white rounded-br-md" 
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className={`block text-xs mt-2 ${isMe ? "text-indigo-100" : "text-gray-500"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={chatRef}></div>
      </div>

      {/* Input Box */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
              rows="1"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
                overflowY: newMsg.length > 100 ? 'auto' : 'hidden'
              }}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={!newMsg.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMsg.trim()
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
