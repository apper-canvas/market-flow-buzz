import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cartService } from "@/services/api/cartService";

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null,
  onRetry,
  className = "" 
}) => {
  const handleAddToCart = (product) => {
    try {
      if (product.stock === 0) {
        toast.error("This product is out of stock");
        return;
      }

cartService.addItem(product.Id, 1);
      
      // Dispatch custom event to update header cart count
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      }
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} className={className} />;
  }

  if (!products || products.length === 0) {
    return (
      <Empty 
        icon="Package"
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for"
        actionLabel="View All Products"
        className={className}
      />
    );
  }

  return (
    <div className={`product-grid ${className}`}>
      {products.map((product, index) => (
        <motion.div
          key={product.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <ProductCard 
            product={product}
            onAddToCart={handleAddToCart}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;