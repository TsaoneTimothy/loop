
import { FeedItem } from "@/types/feed";

// Enhanced mock data for feed items with additional user information
export const feedItems: FeedItem[] = [
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
