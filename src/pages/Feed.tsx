
import { useState } from "react";
import { Bell, Store, Calendar, Newspaper, Bookmark, Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

// Mock data for feed items
const feedItems = [
  {
    id: 1,
    type: "event",
    title: "Annual Tech Fair 2024",
    description: "Join us for the biggest tech showcase of the year! Featuring the latest innovations from student projects.",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    likes: 245,
    comments: 32,
    saved: false
  },
  {
    id: 2,
    type: "announcement",
    title: "Library Hours Extended",
    description: "The library will now be open 24/7 during finals week to accommodate student study schedules.",
    date: "Effective Immediately",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    likes: 567,
    comments: 45,
    saved: true
  },
  {
    id: 3,
    type: "store",
    title: "Campus Store Sale",
    description: "50% off on all university merchandise! Get your college gear before the semester ends.",
    date: "Until April 15",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    likes: 189,
    comments: 12,
    saved: false
  },
  {
    id: 4,
    type: "news",
    title: "Campus Wi-Fi Upgrade",
    description: "The university is upgrading the campus-wide Wi-Fi network to support faster speeds and more connections.",
    date: "April 5, 2024",
    image: "https://images.unsplash.com/photo-1562907550-096d3bf9b25c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80",
    likes: 320,
    comments: 28,
    saved: false
  }
];

// Categories for the feed
const feedCategories = [
  { id: "store", name: "Campus Store", icon: <Store className="h-6 w-6" /> },
  { id: "events", name: "Events", icon: <Calendar className="h-6 w-6" /> },
  { id: "news", name: "News", icon: <Newspaper className="h-6 w-6" /> }
];

const Feed = () => {
  const [items, setItems] = useState(feedItems);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Toggle saved status
  const toggleSaved = (id: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, saved: !item.saved };
        }
        return item;
      })
    );
  };

  // Filter items based on selected category
  const filteredItems = selectedCategory
    ? items.filter((item) => 
        selectedCategory === "events" 
          ? item.type === "event" 
          : item.type === selectedCategory
      )
    : items;

  return (
    <div className="pb-20">
      <header className="loop-header">
        <h1 className="loop-title">Feed</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-6 w-6" />
        </Button>
      </header>
      
      <section className="mt-4 px-6">
        <div className="flex justify-around mb-6">
          {feedCategories.map((category) => (
            <button
              key={category.id}
              className={`flex flex-col items-center gap-2 ${
                selectedCategory === category.id ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => 
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
            >
              <div className={`rounded-full p-4 bg-card border ${
                selectedCategory === category.id ? "border-primary" : "border-border"
              }`}>
                {category.icon}
              </div>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </div>
        
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="loop-card overflow-hidden">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-3">
                <Badge 
                  variant={
                    item.type === "event" 
                      ? "secondary" 
                      : item.type === "announcement" 
                        ? "destructive" 
                        : item.type === "store" 
                          ? "default" 
                          : "outline"
                  }
                  className="px-4 py-1 capitalize"
                >
                  {item.type === "event" && <Calendar className="h-4 w-4 mr-1" />}
                  {item.type === "announcement" && "Announcement"}
                  {item.type === "store" && <Store className="h-4 w-4 mr-1" />}
                  {item.type === "news" && <Newspaper className="h-4 w-4 mr-1" />}
                  {item.type === "event" && "Event"}
                  {item.type === "store" && "Store"}
                  {item.type === "news" && "News"}
                </Badge>
                <span className="text-muted-foreground text-sm">{item.date}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleSaved(item.id)}
                >
                  <Bookmark
                    className={`h-5 w-5 ${item.saved ? "fill-primary text-primary" : ""}`}
                  />
                </Button>
              </div>
              
              {/* Card Image */}
              <div className="h-48 overflow-hidden rounded-lg mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Card Content */}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
              
              {/* Card Footer */}
              <div className="flex justify-between items-center border-t border-border pt-3">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm">{item.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm">{item.comments}</span>
                  </button>
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Feed;
