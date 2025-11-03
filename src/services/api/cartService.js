// Cart service for managing local cart storage
const CART_STORAGE_KEY = "market-flow-cart";

// Simulate API delay for consistency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cartService = {
  async getCartItems() {
    await delay(100);
    
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  },

  async addItem(productId, quantity = 1) {
    await delay(150);
    
    try {
      const cartItems = await this.getCartItems();
      const existingItemIndex = cartItems.findIndex(item => item.productId === parseInt(productId));
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cartItems.push({
          productId: parseInt(productId),
          quantity: quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      return cartItems;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw new Error("Failed to add item to cart");
    }
  },

  async updateQuantity(productId, newQuantity) {
    await delay(100);
    
    try {
      const cartItems = await this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item.productId === parseInt(productId));
      
      if (itemIndex >= 0) {
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          cartItems.splice(itemIndex, 1);
        } else {
          cartItems[itemIndex].quantity = newQuantity;
        }
        
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      }
      
      return cartItems;
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      throw new Error("Failed to update cart quantity");
    }
  },

  async removeItem(productId) {
    await delay(100);
    
    try {
      const cartItems = await this.getCartItems();
      const filteredItems = cartItems.filter(item => item.productId !== parseInt(productId));
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredItems));
      return filteredItems;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw new Error("Failed to remove item from cart");
    }
  },

  async clearCart() {
    await delay(100);
    
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error("Failed to clear cart");
    }
  },

  async getCartCount() {
    await delay(50);
    
    try {
      const cartItems = await this.getCartItems();
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }
  },

  // Sync version for immediate access (used by header component)
  getCartItems() {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  }
};