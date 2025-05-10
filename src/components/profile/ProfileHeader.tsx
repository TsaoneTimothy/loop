
import { Settings, Bell, Share2, Map, Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import EditProfileDialog from "@/components/EditProfileDialog";

interface ProfileHeaderProps {
  profile: any;
  session: any;
  isOwnProfile: boolean;
  isNewUser: boolean;
}

const ProfileHeader = ({ profile, session, isOwnProfile, isNewUser }: ProfileHeaderProps) => {
  return (
    <div className="bg-secondary">
      <header className="loop-header">
        {isOwnProfile && (
          <>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-6 w-6" />
            </Button>
          </>
        )}
      </header>
      
      <div className="flex flex-col items-center pt-4 pb-10">
        <Avatar className="h-24 w-24 mb-4">
          <img src={profile?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"} alt={profile?.full_name || "Profile"} />
        </Avatar>
        
        <h1 className="text-2xl font-bold">{profile?.full_name || "Complete Your Profile"}</h1>
        {isOwnProfile && <p className="text-muted-foreground mb-3">{session?.user?.email}</p>}
        
        {isOwnProfile && <EditProfileDialog />}
        
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
  );
};

export default ProfileHeader;
