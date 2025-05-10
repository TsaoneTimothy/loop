
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { useImageUpload } from "@/hooks/use-image-upload";
import { supabase } from "@/integrations/supabase/client";
import { X, Pencil, ImageIcon } from "lucide-react";

interface NewPostFormProps {
  onClose: () => void;
  onSuccess: () => void;
  postType: string;
}

const NewPostForm: React.FC<NewPostFormProps> = ({
  onClose,
  onSuccess,
  postType,
}) => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const { 
    previewUrl, 
    fileInputRef, 
    handleThumbnailClick, 
    handleFileChange, 
    handleRemove 
  } = useImageUpload();
  
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });
  
  // Additional fields based on post type
  const [store, setStore] = useState("");
  const [price, setPrice] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  // Handle form submission
  const onSubmit = async (values: any) => {
    if (!profile?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload image if present
      let imagePath = null;
      if (previewUrl && fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${profile.id}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);
          
        imagePath = publicUrlData.publicUrl;
      }
      
      // Create object with common fields
      const postData = {
        title: values.title,
        description: values.description,
        location: values.location,
        user_id: profile.id,
        images: imagePath ? [imagePath] : [],
      };
      
      let result;
      if (postType === 'discount' || postType === 'coupon') {
        // Create discount promotion
        result = await supabase
          .from('discount_promotions')
          .insert({
            ...postData,
            store: store,
            price: price ? parseFloat(price) : null,
            expires_at: expiresAt || null,
          });
      } else {
        // Create news/announcement
        result = await supabase
          .from('news_announcements')
          .insert({
            ...postData,
            news_type: postType,
          });
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: "Post created successfully",
        description: "Your post has been published to the feed",
      });
      
      // Reset form and close
      form.reset();
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post",
        description: "There was a problem creating your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render specific fields based on post type
  const renderTypeSpecificFields = () => {
    if (postType === 'discount' || postType === 'coupon') {
      return (
        <>
          <FormItem>
            <FormLabel>Store</FormLabel>
            <FormControl>
              <Input 
                placeholder="Store name" 
                value={store}
                onChange={(e) => setStore(e.target.value)}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Price (optional)" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          
          <FormItem>
            <FormLabel>Expires At</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="Expiry date (optional)" 
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </>
      );
    }
    
    return null;
  };
  
  // Get form title based on post type
  const getFormTitle = () => {
    switch (postType) {
      case 'discount': return 'New Discount';
      case 'coupon': return 'New Coupon';
      case 'event': return 'New Event';
      case 'news': return 'New News Post';
      case 'announcement': return 'New Announcement';
      default: return 'New Post';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{getFormTitle()}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="mb-4">
            <FormLabel className="block mb-2">Image (Optional)</FormLabel>
            <div className="relative">
              {previewUrl ? (
                <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Post preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={handleThumbnailClick}
                  className="flex flex-col items-center justify-center w-full h-32 bg-muted hover:bg-accent rounded-md cursor-pointer border-2 border-dashed border-border"
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          {/* Submit button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
              {!loading && <Pencil className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewPostForm;
