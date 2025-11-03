import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";

const Header = ({ onCartOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const items = cartService.getCartItems();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Shop" },
    { path: "/categories", label: "Categories" },
    { path: "/deals", label: "Deals" },
    { path: "/about", label: "About" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-200",
        isScrolled ? "shadow-lg" : "shadow-sm"
      )}
      initial={false}
      animate={{
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgb(255, 255, 255)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Market Flow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 relative",
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-gradient-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => {
                // Could open a search modal on mobile
                const searchTerm = prompt("Search products...");
                if (searchTerm) handleSearch(searchTerm);
              }}
            >
              <ApperIcon name="Search" size={20} />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={onCartOpen}
            >
              <ApperIcon name="ShoppingCart" size={20} />
              {cartItemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge 
                    variant="error" 
                    size="sm"
                    className="min-w-[20px] h-5 flex items-center justify-center text-xs font-bold rounded-full"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                </motion.div>
              )}
            </Button>

            {/* Account */}
            <Link to="/account">
              <Button variant="ghost" size="sm">
                <ApperIcon name="User" size={20} />
              </Button>
            </Link>

            {/* Admin */}
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden lg:flex">
                <ApperIcon name="Settings" size={20} />
                Admin
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} className="w-full" />
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        className="lg:hidden overflow-hidden border-t border-gray-200 bg-white"
      >
        <div className="px-4 py-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-lg text-base font-medium transition-colors",
                isActive(item.path)
                  ? "text-primary bg-blue-50"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Settings" size={20} />
              Admin Panel
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;