import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CartItem = ({ 
  item,
  onUpdateQuantity,
  onRemove,
  className,
  ...props 
}) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      if (onRemove) onRemove(item.productId);
    } else {
      if (onUpdateQuantity) onUpdateQuantity(item.productId, newQuantity);
    }
  };

  return (
    <div className={cn("flex items-center gap-4 py-4 border-b border-gray-200", className)} {...props}>
      <img
        src={item.productImage || "/api/placeholder/80/80"}
        alt={item.productName}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 truncate">
          {item.productName}
        </h4>
        <p className="text-sm text-gray-600">
          ${item.price} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 w-8 h-8"
        >
          <ApperIcon name="Minus" size={16} />
        </Button>
        
        <span className="text-sm font-medium w-8 text-center">
          {item.quantity}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 w-8 h-8"
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove && onRemove(item.productId)}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;