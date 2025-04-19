
import { useState, useEffect } from "react";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import { ProfileBackgroundImage } from "../ProfileBackgroundImage";
import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileForm } from "../ProfileForm";
import { ProfileDialogHeader } from "./ProfileDialogHeader";
import { ProfileDialogFooter } from "./ProfileDialogFooter";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

export function ProfileDialogContent() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { profile, updateProfile } = useProfile(userId);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function getCurrentUser() {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id);
    }
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (profile?.full_name) {
      const [first, ...rest] = profile.full_name.split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
    }
    setWebsite(profile?.website || "");
    setBio(profile?.bio || "");
  }, [profile]);

  const handleSaveChanges = async () => {
    const fullName = `${firstName} ${lastName}`.trim();
    await updateProfile({
      full_name: fullName,
      bio,
      website: website || null,
    });
  };

  return (
    <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
      <ProfileDialogHeader />
      <DialogDescription className="sr-only">
        Make changes to your profile here. You can change your photo and set a username.
      </DialogDescription>
      <div className="overflow-y-auto">
        <ProfileBackgroundImage defaultImage={profile?.avatar_url} />
        <ProfileAvatar defaultImage={profile?.avatar_url} />
        <div className="px-6 pb-6 pt-4">
          <ProfileForm
            firstName={firstName}
            lastName={lastName}
            website={website}
            bio={bio}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onWebsiteChange={setWebsite}
            onBioChange={setBio}
          />
        </div>
      </div>
      <ProfileDialogFooter onSave={handleSaveChanges} />
    </DialogContent>
  );
}
