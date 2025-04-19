
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProfileDialogContent } from "./profile/dialog/ProfileDialogContent";

interface EditProfileDialogProps {
  trigger?: React.ReactNode;
}

const EditProfileDialog = ({ trigger }: EditProfileDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit profile</Button>}
      </DialogTrigger>
      <ProfileDialogContent />
    </Dialog>
  );
};

export default EditProfileDialog;
