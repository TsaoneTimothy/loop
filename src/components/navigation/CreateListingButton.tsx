
import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

const CreateListingButton = () => {
  return (
    <NavLink to="/create-listing" className="rounded-full bg-primary p-3">
      <Plus className="h-6 w-6 text-white" />
    </NavLink>
  );
};

export default CreateListingButton;
