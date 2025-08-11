import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Send } from 'lucide-react';
import { useUser } from '../context/userContext';
import { useMessage } from '../context/messageContext';

// ChatWindow displays messages for the active conversation from context
const ChatWindow = () => {
  const { user } = useUser();
  const { activeConversation, messages, sendMessage } = useMessage();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const peer = useMemo(() => {
    if (!activeConversation) return null;
    const uniq = [];
    const seen = new Set();
    for (const p of activeConversation.participants || []) {
      if (!p || !p._id) continue;
      if (seen.has(p._id)) continue;
      seen.add(p._id);
      uniq.push(p);
    }
    return uniq.find(p => p._id !== user?._id) || null;
  }, [activeConversation, user?._id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !peer?._id || !activeConversation?._id) return;
    await sendMessage({ conversationId: activeConversation._id, receiverId: peer._id, content: input });
    setInput('');
  };

  if (!peer) return <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Select a conversation</div>;

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur">
        <button
          type="button"
          onClick={() => peer?.userName && navigate(`/profile/${peer.userName}`)}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <img
            src={peer.profilePicture || 'https://i.pravatar.cc/150?img=11'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-400 transition"
          />
          <div className="text-left">
            <p className="text-sm font-semibold group-hover:underline">{peer.userName || peer.name}</p>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => {
          const senderId = m.sender?._id || m.sender || m.senderId?._id || m.senderId;
          const mine = senderId === user._id;
          const prev = messages[i - 1];
          const prevSender = prev ? (prev.sender?._id || prev.sender || prev.senderId?._id || prev.senderId) : null;
          const showAvatar = prevSender !== senderId; // show avatar when sender changed
          return (
            <div key={i} className={`flex w-full ${mine ? 'justify-end' : 'justify-start'}`}>
        {!mine && showAvatar && (
                <img
          src={peer?.profilePicture || 'https://i.pravatar.cc/150?img=11'}
                  className="w-7 h-7 rounded-full object-cover self-end mr-2"
                />
              )}
              <div className={`relative max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-2xl text-sm shadow-sm ${mine ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
                <p>{m.content || m.text}</p>
                <span className="block mt-1 text-[10px] opacity-60">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
              </div>
              {mine && showAvatar && (
                <img
          src={user?.profilePicture || 'https://i.pravatar.cc/150?img=32'}
                  className="w-7 h-7 rounded-full object-cover self-end ml-2"
                />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
          <Image className="w-5 h-5 text-gray-600" />
        </button>
        <input
          value={input}
            onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button type="submit" className="p-2 text-blue-500 hover:text-blue-600"><Send className="w-5 h-5" /></button>
      </form>
    </div>
  );
};

export default ChatWindow;
