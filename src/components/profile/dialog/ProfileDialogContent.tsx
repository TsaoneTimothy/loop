
import { useState, useEffect } from "react";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import { ProfileBackgroundImage } from "../ProfileBackgroundImage";
import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileForm } from "../ProfileForm";
import { ProfileDialogHeader } from "./ProfileDialogHeader";
import { ProfileDialogFooter } from "./ProfileDialogFooter";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ProfileDialogContent() {
  const { profile, updateProfile, loading, isAuthenticated, userId, user } = useProfile();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saveAttempted, setSaveAttempted] = useState(false);

  // Update local state when profile data loads
  useEffect(() => {
    if (profile?.full_name) {
      const nameParts = profile.full_name.split(' ');
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(' ') || "");
    }
    setBio(profile?.bio || "");
    setAvatarUrl(profile?.avatar_url);
    setEmail(user?.email || ""); // Use email from auth user
  }, [profile, user]);

  const handleSaveChanges = async () => {
    setSaveAttempted(true);
    
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to update your profile. Please log in and try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!userId) {
      toast({
        title: "Error",
        description: "Cannot update profile. User not authenticated.",
        variant: "destructive",
      });
      return;
    }

    // Combine first and last name
    const fullName = `${firstName} ${lastName}`.trim();
    
    try {
      console.log("Updating profile with:", { fullName, bio, avatarUrl, email });
      
      // Update profile data
      const profileData: any = {
        id: userId,
        full_name: fullName || "User", // Ensure full_name is not empty
        bio,
      };
      
      // If avatar URL has been updated, include it
      if (avatarUrl !== profile?.avatar_url) {
        profileData.avatar_url = avatarUrl;
      }
      
      await updateProfile(profileData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated"
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    }
  };

  // Handler for avatar updates
  const handleAvatarUpdate = (url: string | null) => {
    console.log("Avatar URL updated:", url);
    setAvatarUrl(url);
  };

  return (
    <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
      <ProfileDialogHeader />
      <DialogDescription className="sr-only">
        Make changes to your profile here. You can change your photo and set a username.
      </DialogDescription>
      
      {saveAttempted && !isAuthenticated && (
        <div className="px-6 pt-4 pb-0">
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
            You're not authenticated. Please log in to update your profile.
          </div>
        </div>
      )}
      
      <div className="overflow-y-auto">
        <ProfileBackgroundImage defaultImage={profile?.avatar_url} />
        <ProfileAvatar 
          defaultImage={profile?.avatar_url} 
          onImageUpdate={handleAvatarUpdate}
        />
        <div className="px-6 pb-6 pt-4">
          <ProfileForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            bio={bio}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onBioChange={setBio}
          />
        </div>
      </div>
      <ProfileDialogFooter onSave={handleSaveChanges} />
    </DialogContent>
  );
}
