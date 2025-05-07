
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthRequired = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
      <p className="text-muted-foreground mb-4">Please sign in to access messages</p>
      <Button onClick={() => navigate("/login")}>Sign In</Button>
    </div>
  );
};

export default AuthRequired;
