  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';
import { useUser } from '../context/userContext.jsx'; // Switch to useUser

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useUser(); // Use the unified context
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(formData);
      // Navigation will be handled by the useEffect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // This effect will run when isAuthenticated state changes after login
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-8 px-10 shadow-sm border border-gray-300 rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900" style={{ fontFamily: 'Billabong, cursive' }}>
              Instagram
            </h1>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="appearance-none block w-full px-2 py-2 border border-gray-300 bg-gray-50 rounded-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 focus:bg-white text-xs"
                required
              />
            </div>

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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-1.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSubmitting ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>

          <div className="mt-4 mb-4 ">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold text-xs">OR</span>
              </div>
            </div>
          </div>

          <GoogleButton />
          <div className="text-center mt-4">
            <a href="#" className="text-xs text-blue-900 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="mt-3 bg-white py-4 px-10 shadow-sm border border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-900">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold text-blue-500 hover:text-blue-400">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <div className="flex flex-wrap justify-center space-x-4 mb-4">
          {[
            'Meta', 'About', 'Blog', 'Jobs', 'Help', 'API',
            'Privacy', 'Terms', 'Locations', 'Instagram Lite',
            'Threads', 'Contact Uploading & Non-Users', 'Meta Verified'
          ].map((item) => (
            <a key={item} href="#" className="hover:underline">{item}</a>
          ))}
        </div>
        <div>
          <select className="bg-transparent border-none text-gray-500 text-xs">
            <option>English</option>
          </select>
          <span className="ml-4">© 2025 Instagram from Meta</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
