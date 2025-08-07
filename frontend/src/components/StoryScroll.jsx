import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useUser } from '../context/userContext';

export default function StoryScroll() {
  const { user } = useUser();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Sample stories data - you would typically fetch this
  const stories = [
    { id: 1, username: "JavaScript", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { id: 2, username: "Node.js", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { id: 3, username: "Express.js", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { id: 4, username: "MongoDB", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { id: 5, username: "React.js", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { id: 6, username: "Socket.io", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
    { id: 7, username: "TailwindCSS", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
    { id: 8, username: "Heroku", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg" },
    { id: 9, username: "Python", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { id: 10, username: "Django", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    { id: 11, username: "Next.js", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { id: 12, username: "Vue.js", avatar: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  ];

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability, { passive: true });
      checkScrollability();
      window.addEventListener('resize', checkScrollability, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      }
    };
  }, [stories]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.7;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative py-2">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-opacity duration-300 hover:scale-105 opacity-90 hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-opacity duration-300 hover:scale-105 opacity-90 hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-4 overflow-x-auto scrollbar-hide px-2 py-3"
        >
          {/* Your Story */}
          <div className="flex-shrink-0 text-center w-[88px] cursor-pointer">
            <div className="relative mx-auto">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'Y'}&size=80`}
                  alt="Your Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 truncate">Your story</p>
          </div>

          {/* Other Stories */}
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 text-center w-[88px] cursor-pointer group">
              <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 mx-auto group-hover:scale-105 transition-transform duration-200">
                <div className="bg-white p-0.5 rounded-full">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full object-contain p-0.5 bg-white rounded-full"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-800 mt-1.5 truncate">{story.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

