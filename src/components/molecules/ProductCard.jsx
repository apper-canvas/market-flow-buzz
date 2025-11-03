import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ 
  product,
  onAddToCart,
  className,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product.Id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card 
      hover
      className={cn("cursor-pointer overflow-hidden", className)}
      onClick={handleProductClick}
      {...props}
    >
      <div className="relative">
        <img
          src={product.images?.[0] || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {product.featured && (
          <Badge 
            variant="accent" 
            size="sm"
            className="absolute top-3 left-3"
          >
            Featured
          </Badge>
        )}
        {discountPercentage > 0 && (
          <Badge 
            variant="error" 
            size="sm"
            className="absolute top-3 right-3"
          >
            -{discountPercentage}%
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="error" size="lg">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <ApperIcon
                  key={i}
                  name="Star"
                  size={16}
                  className={cn(
                    i < Math.floor(product.rating) 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
          
          {product.stock > 0 && product.stock <= 10 && (
            <Badge variant="warning" size="sm">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          icon="Plus"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;