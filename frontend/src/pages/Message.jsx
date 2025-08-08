import React, { useState } from 'react';
import SideBar from '../components/SideBar';
import { MessageCircle, Send, Image, Heart, Phone, Video, Info } from 'lucide-react';
import MessageSearch from '../components/MessageSearch';
import {useUser} from '../context/userContext';
export default function Message() {
  const [search, setSearch] = useState('');
  const { user } = useUser();

  // Placeholder data
  const threads = [
    { id: 1, userName: 'john_doe', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Hey how are you?', time: '2h', unread: 2 },
    { id: 2, userName: 'jane', name: 'Jane', avatar: 'https://i.pravatar.cc/150?img=2', lastMessage: 'Let\'s catch up later.', time: '5h', unread: 0 },
    { id: 3, userName: 'alex99', name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'Sent a photo', time: '1d', unread: 0 },
  ];
  console.log(user.name);

  const filteredThreads = threads.filter(t => t.userName.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));

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
              {filteredThreads.map(thread => (
                <button key={thread.id} className="w-full flex gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                  <div className="relative">
                    <img src={thread.avatar} className="w-12 h-12 rounded-full object-cover" />
                    {thread.unread > 0 && <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">{thread.unread}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{thread.userName}</p>
                    <p className="text-xs text-gray-500 truncate">{thread.lastMessage} · {thread.time}</p>
                  </div>
                </button>
              ))}
              {filteredThreads.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">No conversations</div>
              )}
            </div>
          </div>

          {/* Right column: chat area */}
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?img=1" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">john_doe</p>
                    <p className="text-xs text-gray-500">Active 1h ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <Phone className="w-5 h-5 cursor-pointer hover:text-black" />
                  <Video className="w-5 h-5 cursor-pointer hover:text-black" />
                  <Info className="w-5 h-5 cursor-pointer hover:text-black" />
                </div>
              </div>

              {/* Messages area placeholder */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-gray-50">
                <div className="self-center text-center text-gray-500 text-sm mt-10">
                  <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="font-semibold text-gray-700">Your messages</p>
                  <p className="text-xs text-gray-500">Send private photos and messages to a friend.</p>
                </div>
              </div>

              {/* Composer */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form className="flex items-center gap-3">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="Message..."
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <button type="submit" className="text-sm font-semibold text-blue-500 hover:text-blue-600">Send</button>
                </form>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}

