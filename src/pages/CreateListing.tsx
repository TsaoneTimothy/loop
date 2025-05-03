
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Tag, DollarSign, MapPin, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/shared/Logo";
import { useImageUpload } from "@/hooks/use-image-upload";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Use the image upload hook
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload();
  
  // When we get a new preview URL, add it to our images array
  const handleImageUpload = () => {
    handleThumbnailClick();
  };
  
  // Watch for changes in previewUrl and update images
  useState(() => {
    if (previewUrl && !images.includes(previewUrl)) {
      setImages([...images, previewUrl]);
    }
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // If we removed the current preview, also clear the file input
    if (images[index] === previewUrl) {
      handleRemove();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !location || !selectedCategory) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        toast({
          title: "Authentication required",
          description: "Please log in to create a listing.",
          variant: "destructive",
        });
        return;
      }
      
      // Save the listing to Supabase
      const { data, error } = await supabase
        .from('listings')
        .insert({
          title,
          price: parseFloat(price),
          location,
          description,
          category: selectedCategory,
          images: images,
          user_id: userId
        });
        
      if (error) {
        console.error("Error creating listing:", error);
        toast({
          title: "Error creating listing",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Listing created",
        description: "Your listing has been created successfully.",
      });
      
      navigate("/marketplace");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pb-20">
      <header className="flex items-center justify-between p-4 border-b">
        <Logo />
      </header>
      
      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        <div>
          <Label className="text-lg font-semibold">Photos</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div key={index} className="h-24 rounded-lg overflow-hidden relative">
                <img 
                  src={img} 
                  alt={`Upload ${index+1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <button
                type="button"
                onClick={handleImageUpload}
                className="h-24 border-2 border-dashed border-muted-foreground rounded-lg flex flex-col items-center justify-center text-muted-foreground"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-sm">Add Photo</span>
              </button>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
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
