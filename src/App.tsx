
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

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
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // Check for existing session and set up auth listener
  useEffect(() => {
    // First fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Then set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        setSession(session);
        
        // Check if this is a sign up event
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
          // Check if this is a new user
          checkIfNewUser(session?.user?.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check if the user is new (no profile or incomplete profile)
  const checkIfNewUser = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking if user is new:", error);
        return;
      }
      
      // If no profile or profile with default name, consider as new user
      const newUser = !data || !data.full_name || data.full_name === "User";
      setIsNewUser(newUser);
      
      if (newUser) {
        toast({
          title: "Welcome to Campus Marketplace!",
          description: "Please complete your profile to get started."
        });
      }
    } catch (error) {
      console.error("Error checking if user is new:", error);
    }
  };

  // Logout function using Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsNewUser(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={!session ? <Login /> : <Navigate to={isNewUser ? "/profile" : "/feed"} />} />
              <Route path="/signup" element={!session ? <SignUp /> : <Navigate to={isNewUser ? "/profile" : "/feed"} />} />
              
              {/* Protected routes */}
              <Route path="/" element={session ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                <Route index element={<Navigate to={isNewUser ? "/profile" : "/feed"} replace />} />
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
