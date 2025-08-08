import React from 'react';
import { Search } from 'lucide-react';

const MessageSearch = ({ value, onChange }) => {
  return (
    <div className="px-4 pt-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg bg-gray-100 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300"
        />
      </div>
    </div>
  );
};

export default MessageSearch;
