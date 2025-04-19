
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/use-profile";
import { ProfileBackgroundImage } from "./profile/ProfileBackgroundImage";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileForm } from "./profile/ProfileForm";

interface EditProfileDialogProps {
  trigger?: React.ReactNode;
}

const EditProfileDialog = ({ trigger }: EditProfileDialogProps) => {
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
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit profile</Button>}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Edit profile
          </DialogTitle>
        </DialogHeader>
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
        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleSaveChanges}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
