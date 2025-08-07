import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Home, Compass, MessageCircle, Heart, PlusSquare, User, Settings, LogOut, X } from 'lucide-react';
import { useUser } from '../context/userContext';
import CreatePost from './CreatePost';

const SideBar = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isNotificationsActive, setIsNotificationsActive] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const sidebarRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const activateSearch = () => {
        setIsSearchActive(true);
        setIsNotificationsActive(false);
    };

    const activateNotifications = () => {
        setIsNotificationsActive(true);
        setIsSearchActive(false);
    };

    const deactivatePanels = () => {
        setIsSearchActive(false);
        setIsNotificationsActive(false);
    };

    // Close panels if clicking outside the sidebar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                deactivatePanels();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const profileIcon = user?.profilePicture ? (
        <img src={user.profilePicture} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
    ) : (
        <User size={24} />
    );

    const navItems = [
        { icon: <Home size={24} />, text: 'Home', path: '/' },
        { icon: <Search size={24} />, text: 'Search', action: activateSearch },
        { icon: <Compass size={24} />, text: 'Explore', path: '/explore' },
        { icon: <MessageCircle size={24} />, text: 'Messages', path: '/messages' },
        { icon: <Heart size={24} />, text: 'Notifications', action: activateNotifications },
        { icon: <PlusSquare size={24} />, text: 'Create', action: () => setIsCreateModalOpen(true) },
        { icon: profileIcon, text: 'Profile', path: '/profile' },
    ];

    const isPanelActive = isSearchActive || isNotificationsActive;

    return (
        <>
            <aside ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-white border-r border-gray-300 z-50 flex transition-all duration-300 ${isPanelActive ? 'w-20' : 'w-64'}`}>
                {/* Main Sidebar Navigation */}
                <div className="flex flex-col justify-between w-full p-3">
                    <div>
                        <div className="mb-10 mt-4 px-3">
                            <Link to="/" onClick={deactivatePanels}>
                                {isPanelActive ? (
                                    <img src="/instagram-icon.png" alt="Instagram" className="h-7 w-7" />
                                ) : (
                                    <h1 className="text-2xl" style={{ fontFamily: 'Billabong, cursive' }}>Instagram</h1>
                                )}
                            </Link>
                        </div>
                        <nav>
                            <ul>
                                {navItems.map((item, index) => (
                                    <li key={index}>
                                        {item.path ? (
                                            <NavLink to={item.path} onClick={deactivatePanels} className={({ isActive }) => `flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive ? 'font-bold' : ''}`}>
                                                {item.icon}
                                                {!isPanelActive && <span>{item.text}</span>}
                                            </NavLink>
                                        ) : (
                                            <button onClick={item.action} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                                {item.icon}
                                                {!isPanelActive && <span>{item.text}</span>}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="mb-4">
                        <button className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={handleLogout}>
                            <LogOut size={24} />
                            {!isPanelActive && <span>Logout</span>}
                        </button>
                    </div>
                </div>

                {/* Search & Notifications Panel */}
                <div className={`absolute top-0 left-full h-full bg-white border-r border-gray-300 rounded-r-2xl shadow-lg transition-transform duration-300 w-[400px] ${isPanelActive ? 'translate-x-0' : '-translate-x-full'}`} style={{ zIndex: -1 }}>
                    {isSearchActive && (
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Search</h2>
                            <input 
                             
                            type="text" placeholder="Search" className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300" />
                            <div className="mt-6 text-center text-gray-500">Recent searches will appear here.</div>
                        </div>
                    )}
                    {isNotificationsActive && (
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                            <div className="text-center text-gray-500">You have no new notifications.</div>
                        </div>
                    )}
                </div>
            </aside>

            <CreatePost isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
    );
};

export default SideBar;
