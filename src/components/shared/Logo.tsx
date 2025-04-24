
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

const Logo = ({ className = "", showText = true, size = "medium" }: LogoProps) => {
  const { theme } = useTheme();
  const logoPath = theme === 'dark' 
    ? "/lovable-uploads/b4c1f707-4aee-46a2-8f4b-5c65c7a8253a.png"
    : "/lovable-uploads/c14d3c11-3b00-4f45-9cb6-e620e3ffc849.png";

  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoPath} 
        alt="Loop Marketplace" 
        className={sizeClasses[size]}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${size === "large" ? "text-2xl" : "text-xl"}`}>Loop</span>
          <span className={`-mt-1 text-muted-foreground ${size === "large" ? "text-sm" : "text-xs"}`}>
            MARKETPLACE
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
