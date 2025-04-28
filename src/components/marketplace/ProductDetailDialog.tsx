
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Seller {
  id: number;
  name: string;
  avatar: string;
}

interface ProductDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    title: string;
    price: string;
    condition: string;
    location: string;
    category: string;
    image: string;
    seller: Seller;
  } | null;
}

const ProductDetailDialog = ({ isOpen, onClose, item }: ProductDetailDialogProps) => {
  const navigate = useNavigate();

  if (!item) return null;

  const handleMessageSeller = () => {
    navigate(`/messages?seller=${item.seller.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="relative">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full rounded-lg object-cover aspect-square"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">{item.price}</h3>
              <div className="flex gap-2 items-center">
                <Badge>{item.condition}</Badge>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-muted-foreground">{item.location}</p>
            </div>
            
            <div>
              <Link 
                to={`/profile/${item.seller.id}`}
                className="flex items-center gap-3 hover:bg-accent p-3 rounded-lg transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.seller.avatar} />
                  <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{item.seller.name}</p>
                  <p className="text-sm text-muted-foreground">View Profile</p>
                </div>
              </Link>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleMessageSeller}
            >
              <MessageCircle className="mr-2" />
              Message Seller
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
