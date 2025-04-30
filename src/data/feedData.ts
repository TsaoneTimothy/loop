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
  },
  {
    id: 5,
    type: "discount",
    title: "Student Discount at TechZone",
    description: "Show your student ID at TechZone and get 25% off on all electronic accessories. Perfect for upgrading your study setup!",
    date: "Valid until May 31, 2024",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    orientation: "landscape",
    likes: 412,
    comments: 37,
    saved: false,
    user: {
      id: 5,
      name: "Student Affairs",
      username: "student_affairs",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "admin",
      verified: true
    }
  },
  {
    id: 6,
    type: "coupon",
    title: "STUDENT25 - Spotify Premium",
    description: "Use code STUDENT25 when signing up for Spotify Premium to get 50% off your monthly subscription. Valid with student email verification.",
    date: "Ongoing offer",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    orientation: "landscape",
    likes: 521,
    comments: 42,
    saved: false,
    link: "https://www.spotify.com/premium",
    user: {
      id: 5,
      name: "Student Affairs",
      username: "student_affairs",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "admin",
      verified: true
    }
  },
  {
    id: 7,
    type: "coupon",
    title: "CAMPUSBOOKS10 - Amazon",
    description: "Get 10% off on textbooks on Amazon with code CAMPUSBOOKS10. Perfect for this semester's required readings!",
    date: "Valid until September 30, 2024",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    orientation: "landscape",
    likes: 287,
    comments: 19,
    saved: true,
    link: "https://www.amazon.com/books",
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
    id: 8,
    type: "discount",
    title: "Student Discount: 15% Off Laptops at HiFi Corp",
    description: "Students can get 15% off on selected laptops and computer accessories at HiFi Corp with valid student ID. Perfect for upgrading your study equipment!",
    date: "Valid until June 30, 2024",
    image: "https://images.unsplash.com/photo-1593642702909-dec73df255d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    orientation: "landscape",
    likes: 198,
    comments: 15,
    saved: false,
    link: "https://www.hificorp.co.za/?srsltid=AfmBOoqcFBPuPZHOASPhFe1iaouHy44aCYAzuZFpikiOYXVq3KdVDQzT",
    user: {
      id: 5,
      name: "Student Affairs",
      username: "student_affairs",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "admin",
      verified: true
    }
  },
  {
    id: 9,
    type: "discount",
    title: "Aptec Tech Deals: 20% Student Discount",
    description: "Visit Aptec in Botswana for exclusive 20% student discounts on smartphones, tablets, and accessories. Show your student ID at checkout!",
    date: "Ongoing offer",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    orientation: "landscape",
    likes: 145,
    comments: 8,
    saved: false,
    link: "https://www.aptec.co.bw/",
    user: {
      id: 3,
      name: "Campus Store",
      username: "campus_store",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80",
      role: "merchant",
      verified: true
    }
  }
];
