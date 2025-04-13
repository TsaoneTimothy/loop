
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const CreateListingButton = () => {
  return (
    <Link 
      to="/create-listing" 
      className="fixed bottom-20 right-6 bg-primary text-white p-4 rounded-full shadow-lg md:hidden"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
};

export default CreateListingButton;
