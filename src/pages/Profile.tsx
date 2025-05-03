
import { Settings, Bell, Share2, Map, Bookmark, Heart, Shield, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import EditProfileDialog from "@/components/EditProfileDialog";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProfileProps {
  onLogout: () => void;
}

const Profile = ({ onLogout }: ProfileProps) => {
  const [session, setSession] = useState<any>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { profile, isAuthenticated } = useProfile(userId);
  const [stats, setStats] = useState({
    itemsSold: 0,
    activeListings: 0,
    totalEarnings: "₱0"
  });

  // Get session and user ID on component mount
  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      console.log("Auth session data:", data);
      setSession(data.session);
      setUserId(data.session?.user?.id);
    }
    
    getSession();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      if (!userId) return;
      
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId);

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
  }, [userId]);

  const menuItems = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Privacy & Security",
      description: "Control your account security",
      action: () => toast({ title: "Privacy & Security", description: "This feature is not yet implemented" })
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Payment Methods",
      description: "Manage your payment options",
      action: () => toast({ title: "Payment Methods", description: "This feature is not yet implemented" })
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
      title: "Help & Support",
      description: "Get help with your account",
      action: () => toast({ title: "Help & Support", description: "This feature is not yet implemented" })
    }
  ];

  const handleRefreshAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUserId(data.session?.user?.id);
    if (data.session?.user?.id) {
      toast({ title: "Authentication successful", description: "Your profile has been loaded" });
    } else {
      toast({ 
        title: "Not authenticated", 
        description: "Please log in to update your profile",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="pb-20">
      {/* Authentication Status */}
      <div className="px-6 py-2">
        {isAuthenticated ? (
          <Alert className="bg-green-50 border-green-200 mb-2">
            <AlertTitle className="text-green-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Authenticated
            </AlertTitle>
            <AlertDescription className="text-green-700">
              You're logged in as {session?.user?.email}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-red-50 border-red-200 mb-2">
            <AlertTitle className="text-red-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Not Authenticated
            </AlertTitle>
            <AlertDescription className="text-red-700">
              You need to log in to update your profile
              <Button 
                variant="link" 
                className="text-red-700 p-0 h-auto font-semibold ml-2"
                onClick={handleRefreshAuth}
              >
                Refresh Auth
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="bg-secondary">
        <header className="loop-header">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="h-6 w-6" />
          </Button>
        </header>
        
        <div className="flex flex-col items-center pt-4 pb-10">
          <Avatar className="h-24 w-24 mb-4">
            <img src={profile?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"} alt={profile?.full_name || "Profile"} />
          </Avatar>
          
          <h1 className="text-2xl font-bold">{profile?.full_name || "Loading..."}</h1>
          <p className="text-muted-foreground mb-3">{session?.user?.email}</p>
          
          <EditProfileDialog />
          
          <div className="flex justify-around w-full mt-4">
            <Button variant="ghost" size="icon" className="flex flex-col items-center">
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Settings</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="flex flex-col items-center relative">
              <Bell className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Notifications</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="flex flex-col items-center">
              <Share2 className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Shares</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="flex flex-col items-center">
              <Map className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Maps</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="flex flex-col items-center">
              <Bookmark className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Bookmarks</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="flex flex-col items-center">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xs mt-1">Likes</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-6">
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.itemsSold}</p>
            <p className="text-sm text-muted-foreground">Items Sold</p>
          </div>
          
          <Separator orientation="vertical" />
          
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.activeListings}</p>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </div>
          
          <Separator orientation="vertical" />
          
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.totalEarnings}</p>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </div>
        </div>
        
        <div className="space-y-4 mt-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center gap-4 w-full p-4 bg-card rounded-lg hover:bg-secondary transition-colors"
              onClick={item.action}
            >
              <div className="h-12 w-12 flex items-center justify-center bg-accent rounded-lg">
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))}
          
          <button
            className="flex items-center gap-4 w-full p-4 bg-card rounded-lg hover:bg-secondary transition-colors mt-8"
            onClick={onLogout}
          >
            <div className="h-12 w-12 flex items-center justify-center bg-destructive/10 rounded-lg">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-destructive">Log Out</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
