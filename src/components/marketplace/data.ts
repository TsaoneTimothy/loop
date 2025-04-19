// Mock data for the Marketplace page

export const discounts = [
  {
    id: 1,
    title: "50% Off MacBooks",
    store: "Tech Hub",
    expiresIn: "2 days",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80"
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    store: "Book Corner",
    expiresIn: "5 days",
    image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
  },
  {
    id: 3,
    title: "25% Off All Furniture",
    store: "Campus Living",
    expiresIn: "1 week",
    image: "https://images.unsplash.com/photo-1534281670102-157697563ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 4,
    title: "Summer Sale 30% Off",
    store: "Campus Clothing",
    expiresIn: "3 days",
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  },
  {
    id: 5,
    title: "Free Shipping Weekend",
    store: "Dorm Essentials",
    expiresIn: "4 days",
    image: "https://images.unsplash.com/photo-1505843490701-5be5d0b9af9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
  }
];

export const featuredItems = [
  {
    id: 1,
    title: "MacBook Pro M2",
    price: "₱15,999",
    condition: "Like New",
    location: "Campus Center",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    seller: {
      id: 1,
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
    }
  },
  {
    id: 2,
    title: "Calculus Textbook",
    price: "₱450",
    condition: "Good",
    location: "Library",
    category: "Textbooks",
    image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    seller: {
      id: 2,
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    }
  },
  {
    id: 3,
    title: "Desk Lamp",
    price: "₱250",
    condition: "New",
    location: "Dorm Building A",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1534281670102-157697563ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    seller: {
      id: 3,
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d"
    }
  },
  {
    id: 4,
    title: "Psychology 101",
    price: "₱380",
    condition: "Good",
    location: "Library",
    category: "Textbooks",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    seller: {
      id: 4,
      name: "Sarah Lee",
      avatar: "https://images.unsplash.com/photo-1531427186534-6c19b56e80ce"
    }
  },
  {
    id: 5,
    title: "Gaming Mouse",
    price: "₱899",
    condition: "Like New",
    location: "Engineering Building",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    seller: {
      id: 5,
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00d56c3f6956"
    }
  },
  {
    id: 6,
    title: "Ergonomic Chair",
    price: "₱2,500",
    condition: "Good",
    location: "Off-campus Apartment",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1505843490701-5be5d0b9af9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    seller: {
      id: 6,
      name: "Amy Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd8a72fbc"
    }
  },
  {
    id: 7,
    title: "Bluetooth Speaker",
    price: "₱750",
    condition: "New",
    location: "Music Building",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    seller: {
      id: 7,
      name: "Kevin Wang",
      avatar: "https://images.unsplash.com/photo-1534528741702-a0cfae57fca9"
    }
  },
  {
    id: 8,
    title: "Organic Chemistry",
    price: "₱420",
    condition: "Fair",
    location: "Science Building",
    category: "Textbooks",
    image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    seller: {
      id: 8,
      name: "Lisa Green",
      avatar: "https://images.unsplash.com/photo-1544005313-946690e46691"
    }
  }
];

export const recentListings = [
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
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80"
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

export const categories = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Notes", "Other"];
