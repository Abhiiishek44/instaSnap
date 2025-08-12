import React, { useState, useMemo, useEffect } from 'react';
import SideBar from '../components/SideBar';
import { MessageCircle, Send, Image, Heart, Phone, Video, Info } from 'lucide-react';
import MessageSearch from '../components/MessageSearch';
import {useUser} from '../context/userContext';
import { useMessage } from '../context/messageContext';
import { useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
// Unread badge removed per request

export default function Message() {
  const [search, setSearch] = useState('');
  const { user } = useUser();
  const { conversations, loadingConversations, selectConversation, activeConversation, messages, getOrCreateConversation } = useMessage();
  const { userId: peerUserId } = useParams();

  // If a peer userId is in the route, ensure conversation exists & select it
  useEffect(() => {
    const init = async () => {
      if (peerUserId) {
        const conv = await getOrCreateConversation(peerUserId);
        if (conv) selectConversation(conv);
      }
    };
    init();
  }, [peerUserId, getOrCreateConversation, selectConversation]);

  const filtered = useMemo(() => {
    if (!search) return conversations;
    return conversations.filter(c => {
      const others = c.participants.filter(p => p._id !== user?._id);
      return others.some(p => p.userName?.toLowerCase().includes(search.toLowerCase()));
    });
  }, [search, conversations, user?._id]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <SideBar initialCollapsed={true} />
      <main className="pl-20 transition-all duration-300">
        <div className="mx-auto h-screen flex border-l border-r border-gray-200 bg-white">
          {/* Left column: thread list */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="px-4 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <MessageSearch value={search} onChange={setSearch} />
            <div className="overflow-y-auto flex-1">
              {loadingConversations && <div className="px-4 py-4 text-sm text-gray-500">Loading...</div>}
              {!loadingConversations && filtered.map(conv => {
                // Deduplicate participants, select the other user
                const seen = new Set();
                const unique = [];
                for (const p of conv.participants || []) {
                  if (!p || !p._id) continue;
                  if (seen.has(p._id)) continue;
                  seen.add(p._id);
                  unique.push(p);
                }
                const other = unique.find(p => p._id !== user?._id) || unique[0];
                const last = messages.length && activeConversation?._id === conv._id ? messages[messages.length-1] : null;
                const time = (() => {
                  const ts = (last && (last.createdAt || last.updatedAt)) || conv.lastMessageAt || conv.updatedAt || conv.createdAt;
                  if (!ts) return '';
                  const diff = Date.now() - new Date(ts).getTime();
                  const sec = Math.floor(diff/1000);
                  if (sec < 60) return sec + 's';
                  const min = Math.floor(sec/60);
                  if (min < 60) return min + 'm';
                  const hr = Math.floor(min/60);
                  if (hr < 24) return hr + 'h';
                  const day = Math.floor(hr/24);
                  if (day < 7) return day + 'd';
                  const week = Math.floor(day/7);
                  if (week < 4) return week + 'w';
                  const month = Math.floor(day/30);
                  if (month < 12) return month + 'mo';
                  const yr = Math.floor(day/365);
                  return yr + 'y';
                })();
                // Access unread counts from context via window temporary (will refactor if needed)
                // (Better: consumption via useMessage, but we already invoked above)
                // We'll retrieve unreadCounts through a prop or additional selector if available.
                return (
                  <button
                    key={conv._id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full flex gap-3 px-4 py-3 text-left hover:bg-gray-50 ${activeConversation?._id === conv._id ? 'bg-gray-100' : ''}`}
                  >
                    <div className="relative">
                      <img src={other?.profilePicture || 'https://i.pravatar.cc/150?img=25'} className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{other?.userName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 truncate">{last ? (last.content || last.text) : (conv.lastMessagePreview || 'Tap to chat')}</p>
                    </div>
                    <div className="pl-2 flex flex-col items-end justify-start">
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{time}</span>
                    </div>
                  </button>
                );
              })}
              {!loadingConversations && filtered.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">No conversations</div>
              )}
            </div>
          </div>

          {/* Right column: chat window */}
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}

