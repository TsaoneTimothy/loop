
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

// Refactored components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAuthStatus from "@/components/profile/ProfileAuthStatus";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileSettings from "@/components/profile/ProfileSettings";
import MyListings from "@/components/profile/MyListings";

interface ProfileProps {
  onLogout: () => void;
}

const Profile = ({ onLogout }: ProfileProps) => {
  const params = useParams();
  const [session, setSession] = useState<any>(null);
  const { profile, isAuthenticated, userId } = useProfile();
  const [viewedProfile, setViewedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    itemsSold: 0,
    activeListings: 0,
    totalEarnings: "₱0"
  });
  
  const viewedUserId = params.userId || userId;
  const isOwnProfile = !params.userId || params.userId === userId;
  const isNewUser = isAuthenticated && (!profile || !profile.full_name || profile.full_name === "User");
  const displayedProfile = isOwnProfile ? profile : viewedProfile;

  // Get session and user ID on component mount
  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      console.log("Auth session data:", data);
      setSession(data.session);
    }
    
    getSession();
  }, []);

  // Fetch profile data of viewed user
  useEffect(() => {
    async function fetchViewedProfile() {
      if (!viewedUserId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', viewedUserId)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        setViewedProfile(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchViewedProfile();
  }, [viewedUserId]);

  // Fetch user stats
  useEffect(() => {
    async function fetchStats() {
      if (!viewedUserId) return;
      
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', viewedUserId);

      if (listings) {
        const activeListings = listings.length;
        const totalEarnings = listings.reduce((sum, item) => sum + Number(item.price), 0);
        
        setStats({
          itemsSold: 0, // This would need a 'sold' status in the listings table
          activeListings,
          totalEarnings: `₱${totalEarnings.toLocaleString()}`
        });
      }
    }

    fetchStats();
  }, [viewedUserId]);

  const handleRefreshAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    if (data.session?.user?.id) {
      console.log("Authentication successful");
    }
  };

  return (
    <div className="pb-20">
      {/* Authentication Status - Only show on own profile */}
      {isOwnProfile && (
        <ProfileAuthStatus 
          isAuthenticated={isAuthenticated} 
          session={session} 
          isNewUser={isNewUser}
          handleRefreshAuth={handleRefreshAuth}
        />
      )}

      <ProfileHeader 
        profile={displayedProfile} 
        session={session}
        isOwnProfile={isOwnProfile}
        isNewUser={isNewUser}
      />
      
      <Tabs defaultValue="listings" className="px-6">
        <TabsList className="w-full mb-4 mt-4">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="listings">
          <MyListings userId={viewedUserId} isOwner={isOwnProfile} />
        </TabsContent>
        
        <TabsContent value="stats">
          <ProfileStats stats={stats} />
        </TabsContent>
        
        {isOwnProfile && (
          <TabsContent value="settings">
            <ProfileSettings onLogout={onLogout} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Profile;
