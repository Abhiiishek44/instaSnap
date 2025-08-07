import React from 'react';
import { createContext,useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const register = async (data) => {
        try {   
            const response = await axios.post('http://localhost:5000/api/user/register', data, {
                withCredentials: true
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const login = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/user/login', data, {
                withCredentials: true
            });
            setUser(response.data.user);
            setIsAuthenticated(true);
            console.log(isAuthenticated)
        } catch (error) {
            console.error("Login error:", error);
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

    return(
        <AuthContext.Provider value={{ user, setUser, register, login, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

