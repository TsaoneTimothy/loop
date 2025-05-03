
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);

  // Check for existing session and set up auth listener
  useEffect(() => {
    // First fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Then set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Logout function using Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={!session ? <Login /> : <Navigate to="/feed" />} />
              <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/feed" />} />
              
              {/* Protected routes */}
              <Route path="/" element={session ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to="/feed" replace />} />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
