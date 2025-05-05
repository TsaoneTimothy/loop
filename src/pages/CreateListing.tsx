
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Camera, Tag, DollarSign, MapPin, FileText, X, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/shared/Logo";
import { useImageUpload } from "@/hooks/use-image-upload";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const categories = [
  "Textbooks",
  "Electronics", 
  "Furniture",
  "Clothing",
  "Notes",
  "Other"
];

const postTypes = [
  { id: "product", name: "Product Listing", description: "List an item for sale in the marketplace" },
  { id: "discount", name: "Discount Promotion", description: "Share a discount or special offer" },
  { id: "news", name: "News/Announcement", description: "Share campus news or announcements" }
];

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPostType, setSelectedPostType] = useState("product");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use the image upload hook
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange, handleRemove } = useImageUpload();
  
  // When we get a new preview URL, add it to our images array
  useEffect(() => {
    if (previewUrl && !images.includes(previewUrl)) {
      setImages([...images, previewUrl]);
    }
  }, [previewUrl, images]);
  
  const handleImageUpload = () => {
    handleThumbnailClick();
  };

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
    
    // Validate required fields based on post type
    if (!title || !description || !selectedPostType) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Additional validation for products
    if (selectedPostType === "product" && (!price || !location || !selectedCategory)) {
      toast({
        title: "Missing fields",
        description: "Product listings require price, location, and category.",
        variant: "destructive",
      });
      return;
    }

    // Validation for discount promotions
    if (selectedPostType === "discount" && !expiryDate) {
      toast({
        title: "Missing expiry date",
        description: "Please select when this discount expires.",
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
      
      // Common listing data
      const listingData: any = {
        title,
        description,
        images,
        user_id: userId,
        post_type: selectedPostType
      };

      // Add post type specific fields
      if (selectedPostType === "product") {
        listingData.price = parseFloat(price);
        listingData.location = location;
        listingData.category = selectedCategory;
      } else if (selectedPostType === "discount") {
        listingData.price = price ? parseFloat(price) : null;
        listingData.expires_at = expiryDate?.toISOString();
        listingData.location = location || "Campus-wide";
      } else if (selectedPostType === "news") {
        // News posts don't require price
        listingData.price = null;
        listingData.location = location || "Campus";
      }
      
      console.log("Creating listing with data:", listingData);
      
      // Save the listing to Supabase
      const { error } = await supabase
        .from('listings')
        .insert(listingData);
        
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
        title: "Post created successfully!",
        description: `Your ${selectedPostType} has been posted.`,
      });
      
      // Navigate based on post type
      if (selectedPostType === "product") {
        navigate("/marketplace");
      } else if (selectedPostType === "news" || selectedPostType === "discount") {
        navigate("/feed");
      } else {
        navigate("/marketplace");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
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
        {/* Post Type Selection */}
        <div>
          <Label className="text-lg font-semibold">What are you posting?</Label>
          <RadioGroup
            value={selectedPostType}
            onValueChange={setSelectedPostType}
            className="mt-2 grid gap-2"
          >
            {postTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="flex flex-col">
                  <span className="font-medium">{type.name}</span>
                  <span className="text-sm text-muted-foreground">{type.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

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
        
        {/* Show price field for products and optionally for discounts */}
        {(selectedPostType === "product" || selectedPostType === "discount") && (
          <div>
            <div className="flex items-center bg-card px-4 py-3 rounded-lg">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                type="text"
                placeholder={selectedPostType === "product" ? "Price" : "Discount Amount (optional)"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 p-0"
              />
            </div>
          </div>
        )}
        
        {/* Show location field for all types */}
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
        
        {/* Show expiry date for discount promotions */}
        {selectedPostType === "discount" && (
          <div>
            <Label className="text-lg font-semibold">Expiry Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : <span>Pick an expiry date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={(date) => {
                    setExpiryDate(date);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        {/* Show category selector only for products */}
        {selectedPostType === "product" && (
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
        )}
        
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
          {selectedPostType === "product" ? "List Item" : 
           selectedPostType === "discount" ? "Post Discount" : "Post Announcement"}
        </Button>
      </form>
    </div>
  );
};

export default CreateListing;
