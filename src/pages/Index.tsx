
import Logo from "@/components/shared/Logo";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <Logo className="justify-center" size="large" />
        <p className="text-xl text-muted-foreground">Welcome to Loop Marketplace!</p>
      </div>
    </div>
  );
};

export default Index;
