
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Drawer, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import NewPostTypeSelector from "./NewPostTypeSelector";
import NewPostForm from "./NewPostForm";
import NewPostButton from "../NewPostButton";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";

interface NewPostDialogProps {
  onSuccess?: () => void;
}

const NewPostDialog: React.FC<NewPostDialogProps> = ({ onSuccess = () => {} }) => {
  const [open, setOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<string | null>(null);
  const { isAuthenticated } = useProfile();
  const { toast } = useToast();
  const isDesktop = !useIsMobile();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset selected type when closing
      setSelectedPostType(null);
    }
  };

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  };

  const handleSelectPostType = (type: string) => {
    setSelectedPostType(type);
  };

  const handleSuccess = () => {
    onSuccess();
  };

  // Render content based on the current step
  const renderContent = () => {
    if (!selectedPostType) {
      return (
        <NewPostTypeSelector
          onSelect={handleSelectPostType}
          onClose={() => setOpen(false)}
        />
      );
    }

    return (
      <NewPostForm
        postType={selectedPostType}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />
    );
  };

  // Use Dialog for desktop and Drawer for mobile
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div>
            <NewPostButton onClick={handleButtonClick} />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <div>
          <NewPostButton onClick={handleButtonClick} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        {renderContent()}
      </DrawerContent>
    </Drawer>
  );
};

export default NewPostDialog;
