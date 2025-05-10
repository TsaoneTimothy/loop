
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "@/components/EditProfileDialog";

interface ProfileAuthStatusProps {
  isAuthenticated: boolean;
  session: any;
  isNewUser: boolean;
  handleRefreshAuth: () => void;
}

const ProfileAuthStatus = ({ isAuthenticated, session, isNewUser, handleRefreshAuth }: ProfileAuthStatusProps) => {
  return (
    <div className="px-6 py-2">
      {isAuthenticated ? (
        <Alert className="bg-green-50 border-green-200 mb-2">
          <AlertTitle className="text-green-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Authenticated
          </AlertTitle>
          <AlertDescription className="text-green-700">
            You're logged in as {session?.user?.email}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-red-50 border-red-200 mb-2">
          <AlertTitle className="text-red-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            Not Authenticated
          </AlertTitle>
          <AlertDescription className="text-red-700">
            You need to log in to update your profile
            <Button 
              variant="link" 
              className="text-red-700 p-0 h-auto font-semibold ml-2"
              onClick={handleRefreshAuth}
            >
              Refresh Auth
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isNewUser && isAuthenticated && (
        <div className="mb-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Welcome to Campus Marketplace!
            </AlertTitle>
            <AlertDescription className="text-blue-700 flex flex-col gap-2">
              <p>Looks like you're new here. Set up your profile to get started!</p>
              <EditProfileDialog 
                trigger={<Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 mt-2">Complete Your Profile</Button>} 
              />
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ProfileAuthStatus;
