
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large" | "xl";
}

const Logo = ({ className = "", size = "medium" }: LogoProps) => {
  const { theme } = useTheme();
  const logoPath = "/lovable-uploads/67b928f8-6458-4066-9d9b-c517b384eb7b.png";

  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-12",
    xl: "h-32"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoPath} 
        alt="Loop Marketplace" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default Logo;

