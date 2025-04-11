
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for marketplace items
const featuredItems = [
  {
    id: 1,
    title: "MacBook Pro M2",
    price: "₱15,999",
    condition: "Like New",
    location: "Campus Center",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80"
  },
  {
    id: 2,
    title: "Calculus Textbook",
    price: "₱450",
    condition: "Good",
    location: "Library",
    category: "Textbooks",
    image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
  },
  {
    id: 3,
    title: "Desk Lamp",
    price: "₱250",
    condition: "New",
    location: "Dorm Building A",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1534281670102-157697563ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 4,
    title: "Psychology 101",
    price: "₱380",
    condition: "Good",
    location: "Library",
    category: "Textbooks",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  },
  {
    id: 5,
    title: "Gaming Mouse",
    price: "₱899",
    condition: "Like New",
    location: "Engineering Building",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 6,
    title: "Ergonomic Chair",
    price: "₱2,500",
    condition: "Good",
    location: "Off-campus Apartment",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505843490701-5be5d0b9af9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 7,
    title: "Bluetooth Speaker",
    price: "₱750",
    condition: "New",
    location: "Music Building",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 8,
    title: "Organic Chemistry",
    price: "₱420",
    condition: "Fair",
    location: "Science Building",
    category: "Textbooks",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  }
];

const recentListings = [
  {
    id: 1,
    title: "MacBook Pro M2",
    price: "₱15,999",
    location: "Campus Center",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80"
  },
  {
    id: 2,
    title: "Calculus Textbook",
    price: "₱450",
    location: "Library",
    image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
  },
  {
    id: 5,
    title: "Dorm Chair",
    price: "₱599",
    location: "West Dorm",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80"
  },
  {
    id: 6,
    title: "Study Desk",
    price: "₱1,200",
    location: "North Campus",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80"
  },
  {
    id: 7,
    title: "Wireless Headphones",
    price: "₱799",
    location: "Student Center",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }
];

const categories = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Notes", "Other"];

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-20 md:pb-10">
      <header className="loop-header md:flex md:justify-between md:items-center md:px-8 md:py-6">
        <h1 className="loop-title">Marketplace</h1>
        <div className="flex items-center gap-4">
          <div className="loop-search md:w-[400px]">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search items..." 
              className="border-0 bg-transparent focus-visible:ring-0 pl-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="bg-secondary rounded-full h-10 w-10">
            <Filter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="h-6 w-6" />
          </Button>
        </div>
      </header>
      
      <section className="px-6 md:px-8 overflow-x-auto py-4 border-b border-border">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="rounded-full px-4 py-2 whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>
      
      <div className="md:grid md:grid-cols-12 md:gap-6 md:px-8 md:py-6">
        {/* Main content - Featured items */}
        <div className="md:col-span-8">
          <section className="mt-4 px-6 md:px-0">
            <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-primary font-bold">{item.price}</p>
                      <Badge variant="secondary" className="text-xs">{item.condition}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
        
        {/* Sidebar - Recent listings */}
        <div className="md:col-span-4">
          <section className="mt-6 px-6 md:px-0 md:mt-4">
            <h2 className="text-2xl font-bold mb-4">Recent Listings</h2>
            <div className="space-y-4">
              {recentListings.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-primary font-bold">{item.price}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6">
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Looking for something?</h3>
                  <p className="text-sm mb-4">Post a request and let others help you find what you need.</p>
                  <Button className="w-full">Post a Request</Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
      
      <Link 
        to="/create-listing" 
        className="fixed bottom-20 right-6 bg-primary text-white p-4 rounded-full shadow-lg md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </Link>
    </div>
  );
};

export default Marketplace;
