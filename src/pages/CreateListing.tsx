
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Tag, DollarSign, MapPin, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Notes",
  "Other"
];

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock image upload
  const handleImageUpload = () => {
    // In a real app, this would handle actual file upload
    const mockImageUrl = "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80";
    setImages([...images, mockImageUrl]);
    
    toast({
      title: "Image uploaded",
      description: "Your image has been uploaded successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !location || !selectedCategory) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send data to the backend
    toast({
      title: "Listing created",
      description: "Your listing has been created successfully.",
    });
    
    // Navigate back to marketplace
    navigate("/marketplace");
  };

  return (
    <div className="pb-20">
      <header className="loop-header">
        <h1 className="loop-title">Create Listing</h1>
      </header>
      
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        <div>
          <Label className="text-lg font-semibold">Photos</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div key={index} className="h-24 rounded-lg overflow-hidden">
                <img 
                  src={img} 
                  alt={`Upload ${index+1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleImageUpload}
              className="h-24 border-2 border-dashed border-muted-foreground rounded-lg flex flex-col items-center justify-center text-muted-foreground"
            >
              <Camera className="h-6 w-6 mb-1" />
              <span className="text-sm">Add Photo</span>
            </button>
          </div>
        </div>
        
        <div>
          <div className="flex items-center bg-card px-4 py-3 rounded-lg">
            <Tag className="h-5 w-5 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center bg-card px-4 py-3 rounded-lg">
            <DollarSign className="h-5 w-5 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center bg-card px-4 py-3 rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-lg font-semibold">Category</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                variant={selectedCategory === category ? "default" : "outline"}
                className={`h-10 ${selectedCategory === category ? "bg-primary" : "bg-secondary"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-start bg-card px-4 py-3 rounded-lg">
            <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-2" />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 p-0 min-h-[100px]"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full py-6 mt-6">
          Create Listing
        </Button>
      </form>
    </div>
  );
};

export default CreateListing;
