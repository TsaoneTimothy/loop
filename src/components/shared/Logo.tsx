
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = "", showText = true }: LogoProps) => {
  const { theme } = useTheme();
  const logoPath = theme === 'dark' 
    ? "/lovable-uploads/b4c1f707-4aee-46a2-8f4b-5c65c7a8253a.png"
    : "/lovable-uploads/c14d3c11-3b00-4f45-9cb6-e620e3ffc849.png";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoPath} 
        alt="Loop Marketplace" 
        className="h-8 w-8"
      />
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold">Loop</span>
          <span className="text-xs -mt-1 text-muted-foreground">MARKETPLACE</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
