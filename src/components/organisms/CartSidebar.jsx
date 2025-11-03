import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { productService } from "@/services/api/productService";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = cartService.getCartItems();
      
      // Enrich cart items with product details
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const product = await productService.getById(item.productId);
            return {
              ...item,
              productName: product.name,
              productImage: product.images?.[0],
              price: product.price,
              total: product.price * item.quantity
            };
          } catch (error) {
            // If product not found, return basic item
            return {
              ...item,
              productName: "Product Not Found",
              productImage: null,
              price: 0,
              total: 0
            };
          }
        })
      );
      
      setCartItems(enrichedItems);
    } catch (error) {
      console.error("Error loading cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

const handleUpdateQuantity = (productId, newQuantity) => {
    try {
      cartService.updateQuantity(productId, newQuantity);
      loadCartItems();
      
      // Dispatch custom event to update header cart count
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      }
      
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

const handleRemoveItem = (productId) => {
    try {
      cartService.removeItem(productId);
      loadCartItems();
      
      // Dispatch custom event to update header cart count
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      }
      
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

const handleClearCart = () => {
    try {
      cartService.clearCart();
      setCartItems([]);
      
      // Dispatch custom event to update header cart count
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      }
      
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    onClose();
    navigate("/checkout");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <ApperIcon name="ShoppingCart" size={24} />
                Shopping Cart
                {cartItems.length > 0 && (
                  <span className="text-sm text-gray-500">({cartItems.length})</span>
                )}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="spinner" />
                  <span className="ml-2 text-gray-600">Loading cart...</span>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="text-gray-400 mb-4">
                    <ApperIcon name="ShoppingCart" size={64} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Discover our amazing products and add them to your cart!
                  </p>
                  <Button onClick={() => { onClose(); navigate("/products"); }}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>

                  {/* Clear Cart Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 mb-6"
                  >
                    <ApperIcon name="Trash2" size={16} />
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="font-bold text-lg text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {subtotal < 50 && (
                  <p className="text-xs text-gray-600 mb-4">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                  <ApperIcon name="ArrowRight" size={20} />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;