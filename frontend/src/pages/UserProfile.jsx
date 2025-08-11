import React, { useEffect, useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../context/userContext'
import SideBar from '../components/SideBar'
import {
  Grid,
  Clapperboard,
  UserCheck,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Camera
} from 'lucide-react'

const UserProfile = () => {
  const { userName } = useParams()
  const {
    user: currentUser,
    getUserDetailsByName,
    followUser,
    unfollowUser
  } = useUser()
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showFollowMenu, setShowFollowMenu] = useState(false)

  const navigate = useNavigate()
  console.log('username', userName)
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true)
      try {
        const data = await getUserDetailsByName(userName)

        console.log('Fetched user details:', data)
        setProfileUser(data.user)
        setPosts(data.user.posts)
        if (
          currentUser &&
          data.user.followers.some(follower => follower._id === currentUser._id)
        ) {
          setIsFollowing(true)
        }
      } catch (error) {
        console.error('Failed to fetch user details', error)
      } finally {
        setLoading(false)
      }
    }

    if (userName) {
      fetchUserDetails()
    }
  }, [userName, getUserDetailsByName, currentUser])

  const handleFollowToggle = async () => {
    if (!profileUser || !currentUser) return

    try {
      if (isFollowing) {
        await unfollowUser(profileUser._id)
        setProfileUser(prev => ({
          ...prev,
          followers: prev.followers.filter(
            follower => follower._id !== currentUser._id
          )
        }))
      } else {
        await followUser(profileUser._id)
        setProfileUser(prev => ({
          ...prev,
          followers: [...prev.followers, { _id: currentUser._id }]
        }))
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Failed to follow/unfollow user', error)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        User not found.
      </div>
    )
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      <SideBar />
      <main className='pl-20 lg:pl-64 transition-all duration-300'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <header className='flex items-center gap-8 md:gap-16 mb-8'>
            <div className='flex-shrink-0 w-28 h-28 md:w-36 md:h-36'>
              <img
                className='w-full h-full rounded-full object-cover ring-2 ring-offset-2 ring-gray-200'
                src={
                  profileUser.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileUser.name
                  )}&size=150&background=f3f4f6&color=6b7280`
                }
                alt={`${profileUser.name || profileUser.userName}'s profile`}
              />
            </div>
            <section className='flex-1'>
              <div className='flex items-center gap-4 mb-4 relative'>
                <h1 className='text-2xl font-light text-gray-800'>
                  {profileUser.userName}
                </h1>
                {currentUser && currentUser.userName !== profileUser.userName && (
                  <>
                    <button
                      onClick={() => {
                        if (isFollowing) {
                          setShowFollowMenu(prev => !prev)
                        } else {
                          handleFollowToggle()
                        }
                      }}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                        isFollowing
                          ? 'bg-gray-200 text-black hover:bg-gray-300'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    {showFollowMenu && isFollowing && (
                      <div className='absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-20'>
                        <button
                          onClick={() => {
                            handleFollowToggle()
                            setShowFollowMenu(false)
                          }}
                          className='w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-gray-50'
                        >
                          Unfollow
                        </button>
                        <button
                          onClick={() => setShowFollowMenu(false)}
                          className='w-full text-left px-4 py-2 text-sm hover:bg-gray-50'
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                )}
                {currentUser && currentUser._id !== profileUser._id && (
                  <button
                    onClick={() => navigate(`/messages/${profileUser._id}`)}
                    className='px-4 py-1.5 bg-gray-100 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors'>
                    Message
                  </button>
                )}
                <button className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'>
                  <MoreHorizontal className='w-5 h-5 text-gray-700' />
                </button>
              </div>
              <div className='hidden md:flex gap-8 mb-4'>
                <div className='text-center'>
                  <span className='font-semibold'>{posts.length}</span>
                  <span className='text-gray-600'> posts</span>
                </div>
                <div className='text-center'>
                  <span className='font-semibold'>
                    {profileUser.followers?.length || 0}
                  </span>
                  <span className='text-gray-600'> followers</span>
                </div>
                <div className='text-center'>
                  <span className='font-semibold'>
                    {profileUser.following?.length || 0}
                  </span>
                  <span className='text-gray-600'> following</span>
                </div>
              </div>
              <div className='text-sm'>
                <h2 className='font-semibold text-gray-900'>
                  {profileUser.name}
                </h2>
                {profileUser.bio && (
                  <p className='text-gray-800 whitespace-pre-line'>
                    {profileUser.bio}
                  </p>
                )}
              </div>
            </section>
          </header>
          <div className='border-t border-gray-300'>
            <div className='flex justify-center gap-12'>
              <span className='flex items-center gap-2 py-3 text-xs font-semibold tracking-widest text-black border-t-2 border-black -mt-px'>
                <Grid className='w-4 h-4' />
                <span>POSTS</span>
              </span>
            </div>
          </div>
          <div className='mt-4'>
            {posts.length > 0 ? (
              <div className='grid grid-cols-3 gap-1 md:gap-4'>
                {posts.map(post => (
                  <div
                    key={post._id}
                    className='relative group aspect-square bg-gray-100 cursor-pointer'
                  >
                    <img
                      src={post.image}
                      alt={'Post'}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center'>
                      <div className='flex items-center gap-6 text-white'>
                        <div className='flex items-center gap-2'>
                          <Heart className='w-6 h-6 fill-current' />
                          <span className='font-semibold'>
                            {post.likes?.length || 0}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <MessageCircle className='w-6 h-6 fill-current' />
                          <span className='font-semibold'>
                            {post.comments?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-20'>
                <h2 className='text-2xl font-semibold'>No posts yet</h2>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserProfile
