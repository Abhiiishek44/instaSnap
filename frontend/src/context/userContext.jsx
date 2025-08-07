import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const fetchInProgress = React.useRef(false);

    const getAccountDetails = useCallback(async () => {
        if (fetchInProgress.current) return;
        setLoading(true);
        fetchInProgress.current = true;
        try {
            const response = await axios.get('http://localhost:5000/api/user/me', {
                withCredentials: true,
            });
            if (response.data?.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error.message);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
            fetchInProgress.current = false;
        }
    }, []);

    useEffect(() => {
        getAccountDetails();
    }, [getAccountDetails]);

    const login = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/login', data, {
                withCredentials: true
            });
            if (response.data?.user) {
                await getAccountDetails(); // Fetch details to update context
            }
            return response; // Return the full response
        } catch (error) {
            console.error("Login error:", error);
            throw error; // Re-throw error to be caught in the component
        }
    };

    const register = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/register', data, {
                withCredentials: true
            });
            if (response.data?.user) {
                await getAccountDetails(); // Fetch details to update context
            }
            return response; // Return the full response
        } catch (error) {
            console.error("Registration error:", error);
            throw error; // Re-throw error to be caught in the component
        }
    };

    const logout = async () => {
        try {
            await axios.get('http://localhost:5000/api/user/logout', {
                withCredentials: true
            });
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };



    const uploadPost = async (formData) => { 
        // To properly inspect FormData, you need to iterate over its entries.
        // A direct console.log(formData) will appear empty in most browsers.
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
         
        try {
            const response = await axios.post('http://localhost:5000/api/post/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            return response.data; // Return the response data
        } catch (error) {
            console.error("Upload post error:", error);
            throw error; // Re-throw error to be caught in the component
        }
    };

    const value = { user, setUser, loading, getAccountDetails, isAuthenticated, login, register, logout, uploadPost };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// This is the hook you should use in your components
export const useUser = () => useContext(UserContext);

// Keep userStore for compatibility with your existing Profile component
export const userStore = () => useContext(UserContext);