import React from 'react'
import { useEffect } from 'react';
import GoogleButton from '../components/GoogleButton';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    name: '',
    userName: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await register(formData);
    setIsSubmitting(false);
     navigate('/');
  };
  
     React.useEffect(() => {
        console.log("Register component - isAuthenticated:", isAuthenticated);
       if (isAuthenticated && user) {
         navigate('/');
       }
     }, [isAuthenticated, user, navigate]);
  
  const handleGoogleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Instagram Logo and Registration Form */}
        <div className="bg-white py-8 px-10 shadow-sm border border-gray-300 rounded-lg">
          {/* Instagram Logo */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'Billabong, cursive' }}>
              Instagram
            </h1>
            <p className="text-gray-500 text-base font-semibold mt-4 mb-6 leading-5">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          <form className="space-y-2" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm mb-4">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Mobile Number or Email"
                className="appearance-none block w-full px-2 py-2 border border-gray-300 bg-gray-50 rounded-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white text-xs"
                required
              />
            </div>

            {/* Full Name Input */}
            <div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="appearance-none block w-full px-2 py-2 border border-gray-300 bg-gray-50 rounded-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white text-xs"
                required
              />
            </div>

            {/* Username Input */}
            <div>
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                type="text"
                placeholder="Username"
                className="appearance-none block w-full px-2 py-2 border border-gray-300 bg-gray-50 rounded-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white text-xs"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="appearance-none block w-full px-2 py-2 border border-gray-300 bg-gray-50 rounded-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white text-xs"
                required
              />
            </div>

            {/* Terms and Privacy */}
            <div className="text-center py-2">
              <p className="text-xs text-gray-500 leading-4">
                People who use our service may have uploaded your contact information to Instagram.{' '}
                <a href="#" className="text-blue-900 hover:underline">
                  Learn More
                </a>
              </p>
              <p className="text-xs text-gray-500 leading-4 mt-3">
                By signing up, you agree to our{' '}
                <a href="#" className="text-blue-900 hover:underline">
                  Terms
                </a>
                ,{' '}
                <a href="#" className="text-blue-900 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-900 hover:underline">
                  Cookies Policy
                </a>
                .
              </p>
            </div>

            {/* Sign Up Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-1.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="mt-6 mb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold text-xs">OR</span>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <GoogleButton />
        </div>

        {/* Login Link */}
        <div className="mt-3 bg-white py-4 px-10 shadow-sm border border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-900">
              Have an account?{' '}
              <a href="/login" className="font-semibold text-blue-500 hover:text-blue-400">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8">
        <div className="text-center">
          <div className="flex flex-wrap justify-center space-x-4 text-xs text-gray-500 mb-4">
            <a href="#" className="hover:underline">Meta</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">API</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Locations</a>
            <a href="#" className="hover:underline">Instagram Lite</a>
            <a href="#" className="hover:underline">Threads</a>
            <a href="#" className="hover:underline">Contact Uploading & Non-Users</a>
            <a href="#" className="hover:underline">Meta Verified</a>
          </div>
          <div className="text-xs text-gray-500">
            <select className="bg-transparent border-none text-gray-500 text-xs">
              <option>English</option>
            </select>
            <span className="ml-4">© 2025 Instagram from Meta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
