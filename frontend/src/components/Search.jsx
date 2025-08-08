import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const { searchUsers } = useUser();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const timerId = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const users = await searchUsers(searchQuery);
                setSearchResults(users);
            } catch (error) {
                console.error("Search failed:", error);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timerId);
    }, [searchQuery, searchUsers]);

    const handleUserClick = (username) => {
        navigate(`/profile/${username}`);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Search</h2>
            <input
                type="text"
                placeholder="Search"
                className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="mt-6 flex-1 overflow-y-auto">
                {searchLoading ? (
                    <div className="text-center text-gray-500 pt-10">Searching...</div>
                ) : searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((result) => (
                            <li 
                                key={result._id} 
                                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleUserClick(result.userName)}
                            >
                                <img 
                                    src={result.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&size=40&background=random`} 
                                    alt={result.name} 
                                    className="w-10 h-10 rounded-full object-cover" 
                                />
                                <div>
                                    <div className="font-semibold">{result.userName}</div>
                                    <div className="text-sm text-gray-500">{result.name}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : searchQuery && (
                    <div className="text-center text-gray-500 pt-10">No results found.</div>
                )}
            </div>
        </div>
    );
};

export default Search;
