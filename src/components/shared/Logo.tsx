
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large" | "xl";
}

const Logo = ({ className = "", size = "medium" }: LogoProps) => {
  const { theme } = useTheme();
  const logoPath = "/lovable-uploads/1bc2c131-d7fb-478c-b9e8-02dc3089e2aa.png";

  const sizeClasses = {
    small: "h-40",
    medium: "h-50",
    large: "h-60",
    xl: "h-160"
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

