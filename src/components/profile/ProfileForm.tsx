
import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  website: string;
  bio: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function ProfileForm({
  firstName,
  lastName,
  website,
  bio,
  onFirstNameChange,
  onLastNameChange,
  onWebsiteChange,
  onBioChange,
}: ProfileFormProps) {
  const id = useId();
  const maxLength = 180;
  const {
    value: bioValue,
    characterCount,
    handleChange: handleBioChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: bio,
  });

  const handleBioUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleBioChange(e);
    onBioChange(e.target.value);
  };

  return (
    <form className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`${id}-first-name`}>First name</Label>
          <Input
            id={`${id}-first-name`}
            placeholder="First name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            type="text"
            required
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor={`${id}-last-name`}>Last name</Label>
          <Input
            id={`${id}-last-name`}
            placeholder="Last name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            type="text"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-website`}>Website</Label>
        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
            https://
          </span>
          <Input
            id={`${id}-website`}
            className="-ms-px rounded-s-none shadow-none"
            placeholder="yourwebsite.com"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            type="text"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-bio`}>Biography</Label>
        <Textarea
          id={`${id}-bio`}
          placeholder="Write a few sentences about yourself"
          value={bioValue}
          maxLength={maxLength}
          onChange={handleBioUpdate}
          aria-describedby={`${id}-description`}
        />
        <p
          id={`${id}-description`}
          className="mt-2 text-right text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <span className="tabular-nums">{limit - characterCount}</span> characters left
        </p>
      </div>
    </form>
  );
}
