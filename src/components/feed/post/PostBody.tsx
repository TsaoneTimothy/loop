
import React from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface PostBodyProps {
  title: string;
  description: string;
  image: string;
  orientation: string;
  link?: string;
  expiresAt?: string;
  isDiscount: boolean;
  type: string;
}

const PostBody: React.FC<PostBodyProps> = ({ 
  title, 
  description, 
  image, 
  orientation, 
  link, 
  expiresAt, 
  isDiscount, 
  type 
}) => {
  const renderTitle = () => {
    if (link) {
      return (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xl font-bold mb-2 hover:text-primary transition-colors"
        >
          {title} <span className="text-xs">↗</span>
        </a>
      );
    }
    return <h3 className="text-xl font-bold mb-2">{title}</h3>;
  };

  return (
    <>
      {renderTitle()}
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      
      {/* Expiry date for discounts */}
      {(type === "discount" || type === "coupon") && expiresAt && (
        <div className="flex items-center gap-1 mb-3 text-sm">
          <Clock className={`h-4 w-4 ${isDiscount ? 'text-purple-600 dark:text-purple-400' : 'text-muted-foreground'}`} />
          <span className={`${isDiscount ? 'text-purple-600 dark:text-purple-400' : 'text-muted-foreground'}`}>
            Expires: {expiresAt}
          </span>
        </div>
      )}
      
      {/* Card Image - Responsive based on orientation */}
      <div 
        className={`overflow-hidden rounded-lg mb-3 ${
          orientation === "portrait" 
            ? "h-64 md:h-80 w-full md:w-2/3 mx-auto" 
            : "h-48 md:h-64 w-full"
        }`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};

export default PostBody;
