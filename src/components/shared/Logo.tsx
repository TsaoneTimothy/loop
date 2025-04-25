
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large" | "xl";
}

const Logo = ({ className = "", size = "medium" }: LogoProps) => {
  const { theme } = useTheme();
  const logoPath = "/lovable-uploads/67b928f8-6458-4066-9d9b-c517b384eb7b.png";

  const sizeClasses = {
    small: "h-40",    // Increased from h-8
    medium: "h-50",   // Increased from h-10
    large: "h-60",    // Increased from h-12
    xl: "h-160"       // Increased from h-32
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

