import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Grid, Clapperboard, UserCheck, MoreHorizontal, Heart, MessageCircle, Camera } from 'lucide-react';
import SideBar from "../components/SideBar";
import {useUser} from "../context/userContext.jsx";
import axios from 'axios';

const Profile = () => {
    const { user, isAuthenticated, getUserPosts } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const profilePictureInputRef = useRef(null);

    // Function to handle profile picture click
    const handleProfilePictureClick = () => {
        profilePictureInputRef.current?.click();
    };

    // Function to handle profile picture upload
    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await axios.post('http://localhost:5000/api/user/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to upload profile picture:', error);
            alert('Failed to upload profile picture. Please try again.');
        }
    };

    useEffect(() => {
        getUserPosts(setPosts, setLoading);
    }, [user, isAuthenticated, getUserPosts]);

    // Placeholder for story highlights
    const storyHighlights = [
        { id: 1, label: 'Travel' },
        { id: 2, label: 'Food' },
        { id: 3, label: 'Projects' },
        { id: 4, label: 'Friends' },
        { id: 5, label: 'More' },
    ];

    if (!isAuthenticated || !user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in to view your profile</h2>
                        <NavLink 
                            to="/login" 
                            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Go to Login
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <SideBar />
            <main className="pl-20 lg:pl-64 transition-all duration-300">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Profile Header */}
                    <header className="flex items-center gap-8 md:gap-16 mb-8">
                        <div className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 relative group">
                            <img
                                className="w-full h-full rounded-full object-cover ring-2 ring-offset-2 ring-gray-200 cursor-pointer transition-opacity group-hover:opacity-75"
                                src={user.profilePicture || user.avatar}
                                alt={`${user.name || user.userName}'s profile`}
                                onClick={handleProfilePictureClick}
                            />  
                            <div 
                                className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                                onClick={handleProfilePictureClick}
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            <input
                                type="file"
                                ref={profilePictureInputRef}
                                onChange={handleProfilePictureUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <section className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-2xl font-light text-gray-800">{user.userName}</h1>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                        Edit profile
                                    </button>
                                    <button className="px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                        View archive
                                    </button>
                                </div>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreHorizontal className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>

                            <div className="hidden md:flex gap-8 mb-4">
                                <div className="text-center">
                                    <span className="font-semibold">{posts.length}</span>
                                    <span className="text-gray-600"> posts</span>
                                </div>
                                <div className="text-center cursor-pointer hover:text-gray-800">
                                    <span className="font-semibold">{user.followers?.length || 0}</span>
                                    <span className="text-gray-600"> followers</span>
                                </div>
                                <div className="text-center cursor-pointer hover:text-gray-800">
                                    <span className="font-semibold">{user.following?.length || 0}</span>
                                    <span className="text-gray-600"> following</span>
                                </div>
                            </div>

                            <div className="text-sm">
                                <h2 className="font-semibold text-gray-900">{user.name}</h2>
                                {user.title && <p className="text-gray-500">{user.title}</p>}
                                {user.bio && <p className="text-gray-800 whitespace-pre-line">{user.bio}</p>}
                                {user.website && (
                                    <a
                                        href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                        className="text-blue-900 font-semibold hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {user.website}
                                    </a>
                                )}
                            </div>
                        </section>
                    </header>

                    {/* Story Highlights */}
                    <div className="mb-10">
                        <div className="flex items-center gap-6">
                            {storyHighlights.map(highlight => (
                                <div key={highlight.id} className="text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 ring-1 ring-offset-2 ring-gray-100 flex items-center justify-center cursor-pointer hover:ring-gray-300">
                                        {/* Placeholder for highlight image */}
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{highlight.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-gray-300">
                        <div className="flex justify-center gap-12">
                            <NavLink to="/profile" end className={({ isActive }) => `flex items-center gap-2 py-3 text-xs font-semibold tracking-widest ${isActive ? "text-black border-t-2 border-black -mt-px" : "text-gray-500"}`}>
                                <Grid className="w-4 h-4" />
                                <span>POSTS</span>
                            </NavLink>
                            <NavLink to="/profile/reels" className={({ isActive }) => `flex items-center gap-2 py-3 text-xs font-semibold tracking-widest ${isActive ? "text-black border-t-2 border-black -mt-px" : "text-gray-500"}`}>
                                <Clapperboard className="w-4 h-4" />
                                <span>REELS</span>
                            </NavLink>
                            <NavLink to="/profile/tagged" className={({ isActive }) => `flex items-center gap-2 py-3 text-xs font-semibold tracking-widest ${isActive ? "text-black border-t-2 border-black -mt-px" : "text-gray-500"}`}>
                                <UserCheck className="w-4 h-4" />
                                <span>TAGGED</span>
                            </NavLink>
                        </div>
                    </div>

                    {/* Posts Grid or Outlet */}
                    <div className="mt-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="text-gray-500">Loading posts...</div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-24 h-24 border-2 border-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Camera className="w-10 h-10 text-gray-800" />
                                </div>
                                <h2 className="text-3xl font-light text-gray-900">Share Photos</h2>
                                <p className="text-gray-600 mt-2">When you share photos, they will appear on your profile.</p>
                                <button 
                                    className="text-blue-500 font-semibold mt-4 hover:text-blue-700"
                                    onClick={() => window.location.reload()} // Refresh to check for new posts
                                >
                                    Share your first photo
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-1 md:gap-4">
                                {posts.map((post) => (
                                    <div key={post._id} className="relative group aspect-square bg-gray-100 cursor-pointer">
                                        <img
                                            src={post.image}
                                            alt={'Post'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center">
                                            <div className="flex items-center gap-6 text-white">
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-6 h-6 fill-current" />
                                                    <span className="font-semibold">{post.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle className="w-6 h-6 fill-current" />
                                                    <span className="font-semibold">{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
