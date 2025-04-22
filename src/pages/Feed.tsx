
import { useState } from "react";
import { Bell, Store, Calendar, Newspaper, Bookmark, Heart, MessageSquare, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/context/ThemeContext";

// Enhanced mock data for feed items with additional user information
const feedItems = [
  {
    id: 1,
    type: "event",
    title: "Annual Tech Fair 2024",
    description: "Join us for the biggest tech showcase of the year! Featuring the latest innovations from student projects.",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    orientation: "landscape",
    likes: 245,
    comments: 32,
    saved: false,
    user: {
      id: 1,
      name: "Campus Events",
      username: "campus_events",
      avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "admin",
      verified: true
    }
  },
  {
    id: 2,
    type: "announcement",
    title: "Library Hours Extended",
    description: "The library will now be open 24/7 during finals week to accommodate student study schedules.",
    date: "Effective Immediately",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    orientation: "landscape",
    likes: 567,
    comments: 45,
    saved: true,
    user: {
      id: 2,
      name: "Library Services",
      username: "library_services",
      avatar: "https://images.unsplash.com/photo-1589395937772-f67057e233df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "admin",
      verified: true
    }
  },
  {
    id: 3,
    type: "store",
    title: "Campus Store Sale",
    description: "50% off on all university merchandise! Get your college gear before the semester ends.",
    date: "Until April 15",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    orientation: "landscape",
    likes: 189,
    comments: 12,
    saved: false,
    user: {
      id: 3,
      name: "Campus Store",
      username: "campus_store",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "merchant",
      verified: true
    }
  },
  {
    id: 4,
    type: "news",
    title: "Campus Wi-Fi Upgrade",
    description: "The university is upgrading the campus-wide Wi-Fi network to support faster speeds and more connections.",
    date: "April 5, 2024",
    image: "https://images.unsplash.com/photo-1562907550-096d3bf9b25c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=689&q=80",
    orientation: "portrait",
    likes: 320,
    comments: 28,
    saved: false,
    user: {
      id: 4,
      name: "IT Services",
      username: "it_services",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "admin",
      verified: true
    }
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
    <div className="pb-20 md:px-10 relative">
      {/* Floating Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-card shadow-lg rounded-full p-2">
          <ThemeToggle />
        </div>
      </div>
      
      <header className="loop-header">
        <h1 className="loop-title">Feed</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-6 w-6" />
        </Button>
      </header>
      
      <section className="mt-4 px-4 md:px-6">
        <div className="flex justify-center mb-6">
          <div className="flex gap-8">
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
                <div className={`rounded-full p-3 bg-card border ${
                  selectedCategory === category.id ? "border-primary" : "border-border"
                }`}>
                  {category.icon}
                </div>
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="loop-card overflow-hidden">
                {/* User Profile Header */}
                <div className="flex items-center mb-4">
                  <Link to={`/profile/${item.user.id}`} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={item.user.avatar} alt={item.user.name} />
                      <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{item.user.name}</span>
                        {item.user.verified && (
                          <span className="text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        @{item.user.username} • 
                        <span className="ml-1 capitalize">
                          {item.user.role === "merchant" ? "Seller" : item.user.role}
                        </span>
                      </span>
                    </div>
                  </Link>
                  <div className="ml-auto">
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
                </div>
                
                {/* Badge for post type */}
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
                    className="px-3 py-1 capitalize flex items-center gap-1"
                  >
                    {item.type === "event" && <Calendar className="h-3 w-3" />}
                    {item.type === "announcement" && "Announcement"}
                    {item.type === "store" && <Store className="h-3 w-3" />}
                    {item.type === "news" && <Newspaper className="h-3 w-3" />}
                    {item.type === "event" && "Event"}
                    {item.type === "store" && "Store"}
                    {item.type === "news" && "News"}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{item.date}</span>
                </div>
                
                {/* Post Title */}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                
                {/* Card Image - Responsive based on orientation */}
                <div 
                  className={`overflow-hidden rounded-lg mb-3 ${
                    item.orientation === "portrait" 
                      ? "h-64 md:h-80 w-full md:w-2/3 mx-auto" 
                      : "h-48 md:h-64 w-full"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Card Footer */}
                <div className="flex justify-between items-center border-t border-border pt-3">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm">{item.likes}</span>
                    </button>
                    
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">{item.comments}</span>
                    </button>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feed;
