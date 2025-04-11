
import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User, Store, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Feed">
                <NavLink to="/feed" className={({ isActive }) => isActive ? "text-primary" : ""}>
                  <Home />
                  <span>Feed</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Marketplace">
                <NavLink to="/marketplace" className={({ isActive }) => isActive ? "text-primary" : ""}>
                  <Store />
                  <span>Marketplace</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Create Listing">
                <NavLink to="/create-listing" className={({ isActive }) => isActive ? "text-primary" : ""}>
                  <Plus />
                  <span>Create Listing</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages">
                <NavLink to="/messages" className={({ isActive }) => isActive ? "text-primary" : ""}>
                  <MessageCircle />
                  <span>Messages</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile">
                <NavLink to="/profile" className={({ isActive }) => isActive ? "text-primary" : ""}>
                  <User />
                  <span>Profile</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;
