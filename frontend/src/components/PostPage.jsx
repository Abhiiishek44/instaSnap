import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

const PostPage = () => {
  // Sample data for a single post
  const post = {
    id: 1,
    user: {
      name: 'the_developer',
      avatar: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    },
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    caption: 'Just finished a new component in React! Loving the development process. #coding #react #webdev',
    likes: 1023,
    comments: [
      { id: 1, user: 'another_dev', text: 'Looks awesome! 🔥' },
      { id: 2, user: 'design_guru', text: 'Clean UI! Great job.' },
    ],
    timestamp: '2 hours ago',
  };

  return (
    <div className="w-full max-w-[500px] bg-white border border-gray-200 rounded-lg shadow-sm mx-auto my-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={post.user.avatar} alt={post.user.name} className="w-8 h-8 rounded-full object-contain p-0.5 border-2 border-pink-500" />
          <span className="font-semibold text-sm">{post.user.name}</span>
        </div>
        <button>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Image */}
      <div>
        <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />
      </div>

      {/* Post Actions */}
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-500 transition-colors">
            <Heart size={24} />
          </button>
          <button className="hover:text-gray-500 transition-colors">
            <MessageCircle size={24} />
          </button>
          <button className="hover:text-gray-500 transition-colors">
            <Send size={24} />
          </button>
        </div>
        <button className="hover:text-gray-500 transition-colors">
          <Bookmark size={24} />
        </button>
      </div>

      {/* Likes and Caption */}
      <div className="px-3 pb-2">
        <p className="font-semibold text-sm">{post.likes.toLocaleString()} likes</p>
        <p className="text-sm mt-1">
          <span className="font-semibold">{post.user.name}</span> {post.caption}
        </p>
      </div>

      {/* Comments Section */}
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-500 cursor-pointer">View all {post.comments.length} comments</p>
        {post.comments.slice(0, 2).map(comment => (
          <div key={comment.id} className="text-sm mt-1">
            <span className="font-semibold">{comment.user}</span> {comment.text}
          </div>
        ))}
      </div>

      {/* Timestamp and Add Comment */}
      <div className="px-3 pb-3 border-t border-gray-200 pt-2">
         <p className="text-xs text-gray-400 uppercase">{post.timestamp}</p>
         <div className="mt-2">
            <input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full bg-transparent text-sm focus:outline-none"
            />
         </div>
      </div>
    </div>
  );
};

export default PostPage;