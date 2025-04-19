
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProfileDialogHeader() {
  return (
    <DialogHeader className="contents space-y-0 text-left">
      <DialogTitle className="border-b border-border px-6 py-4 text-base">
        Edit profile
      </DialogTitle>
    </DialogHeader>
  );
}
