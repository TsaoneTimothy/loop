
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProfileDialogFooterProps {
  onSave: () => Promise<void>;
}

export function ProfileDialogFooter({ onSave }: ProfileDialogFooterProps) {
  return (
    <div className="border-t border-border px-6 py-4 flex justify-end gap-2">
      <DialogClose asChild>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button type="button" onClick={onSave}>
          Save changes
        </Button>
      </DialogClose>
    </div>
  );
}
