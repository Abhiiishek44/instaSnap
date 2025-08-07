import React from 'react';
import SideBar from '../components/SideBar';
import StoryScroll from '../components/StoryScroll';
import PostPage from '../components/PostPage';
import Suggestion from '../components/Suggestion';

export default function Home() {

  return (
    <div className="bg-gray-50 min-h-screen">
      <SideBar />
      <main className="pl-20 lg:pl-64 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Main Content: Stories and Posts */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Wider container for StoryScroll */}
            <div className="w-full max-w-[614px] px-2">
              <div className="top-0 z-10 bg-gray-50">
                <StoryScroll />
              </div>
            </div>
            
            {/* Container for posts */}
            <div className="w-full max-w-lg">
              <div className="mt-8">
                <PostPage />
                {/* You can map through multiple posts here */}
              </div>
            </div>
          </div>
          {/* Right Sidebar: Suggestions */}
          <div className="hidden lg:block lg:col-span-1 pt-10">
             <div className="w-[320px]">
                <Suggestion />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

 