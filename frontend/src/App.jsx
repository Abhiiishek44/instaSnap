import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Message from "./pages/message.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import Layout from "./pages/Layout.jsx";
import { UserProvider } from "./context/userContext.jsx";
const UserProfile = lazy(() => import('./pages/UserProfile.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

const App = () => {
  return (
    <Router>
        <UserProvider>
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><div>Loading...</div></div>}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="/profile" element={<Profile />}>
                  <Route path="posts" element={<h1>Posts</h1>} />
                  <Route path="reels" element={<h1>Reels</h1>} />
                  <Route path="tagged" element={<h1>Tagged</h1>} />
                </Route>
                <Route path="/messages" element={<Message />} />
              </Route>
              <Route path="/profile/:userName" element={<UserProfile />} />
            </Routes>
          </Suspense>
        </UserProvider>
    </Router>
  );
};

export default App;
