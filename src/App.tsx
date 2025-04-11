
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Marketplace from "./pages/Marketplace";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Mock login function
  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials
    localStorage.setItem("user", JSON.stringify({ email }));
    setIsLoggedIn(true);
    return true;
  };

  // Mock logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/marketplace" />} />
            <Route path="/signup" element={!isLoggedIn ? <SignUp /> : <Navigate to="/marketplace" />} />
            
            {/* Protected routes */}
            <Route path="/" element={isLoggedIn ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
              <Route index element={<Navigate to="/marketplace" replace />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="feed" element={<Feed />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<Profile onLogout={handleLogout} />} />
              <Route path="create-listing" element={<CreateListing />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
