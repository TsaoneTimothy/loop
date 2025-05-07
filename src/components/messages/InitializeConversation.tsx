
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessageUser } from "@/types/messages";

interface InitializeConversationProps {
  userId: string | null;
  isAuthenticated: boolean;
  setSelectedUser: React.Dispatch<React.SetStateAction<MessageUser | null>>;
  loadMessages: (partnerId: string) => Promise<void>;
}

const InitializeConversation = ({
  userId,
  isAuthenticated,
  setSelectedUser,
  loadMessages
}: InitializeConversationProps) => {
  const [searchParams] = useSearchParams();

  // Handle seller selection from URL parameters
  useEffect(() => {
    const initializeConversation = async () => {
      const sellerId = searchParams.get("seller");
      if (!sellerId || !userId) return;
      
      try {
        // Fetch seller profile
        const { data: sellerProfile, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', sellerId)
          .single();
          
        if (error) {
          console.error("Error fetching seller profile:", error);
          return;
        }
          
        if (sellerProfile) {
          setSelectedUser({
            id: sellerProfile.id,
            name: sellerProfile.full_name || 'User',
            avatar: sellerProfile.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
          });
          
          // Load existing messages
          loadMessages(sellerId);
        }
      } catch (error) {
        console.error("Error initializing conversation:", error);
      }
    };
    
    if (userId && isAuthenticated) {
      initializeConversation();
    }
  }, [searchParams, userId, isAuthenticated, setSelectedUser, loadMessages]);

  return null;
};

export default InitializeConversation;
