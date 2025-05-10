
import { Shield, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  onLogout: () => void;
}

const ProfileSettings = ({ onLogout }: ProfileSettingsProps) => {
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

  return (
    <div className="space-y-4 mt-4">
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
  );
};

export default ProfileSettings;
