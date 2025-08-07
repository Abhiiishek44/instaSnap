import React from 'react';
import { useUser } from '../context/userContext';

const Suggestion = () => {
  const { user } = useUser();

  // Sample data for suggestions
  const suggestions = [
    { id: 1, name: 'react_official', reason: 'Followed by another_dev', avatar: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { id: 2, name: 'nodejs', reason: 'New to Instagram', avatar: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { id: 3, name: 'tailwindcss', reason: 'Popular', avatar: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
    { id: 4, name: 'mongodb_inc', reason: 'Followed by design_guru', avatar: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { id: 5, name: 'vuejs', reason: 'Suggested for you', avatar: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
  ];

  return (
    <div className="w-full max-w-sm">
      {/* Current User */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&size=56`}
            alt="Your profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-base">{user?.userName || 'your_username'}</p>
            <p className="text-gray-500 text-base">{user?.name || 'Your Name'}</p>
          </div>
        </div>
        <button className="text-blue-500 font-semibold text-sm hover:text-gray-900">
          Switch
        </button>
      </div>

      {/* Suggestions */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-500 text-base">Suggestions for you</p>
          <button className="text-sm font-semibold hover:text-gray-500">See All</button>
        </div>
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-contain" />
                <div>
                  <p className="font-semibold text-base">{s.name}</p>
                  <p className="text-gray-400 text-sm">{s.reason}</p>
                </div>
              </div>
              <button className="text-blue-500 font-semibold text-sm hover:text-gray-900">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-400">
        <ul className="flex flex-wrap gap-x-2">
          <li><a href="#" className="hover:underline">About</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Help</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Press</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">API</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Jobs</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Privacy</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Terms</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Locations</a></li>
          <li>·</li>
          <li><a href="#" className="hover:underline">Language</a></li>
        </ul>
        <p className="mt-4 uppercase">© 2025 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

export default Suggestion;


