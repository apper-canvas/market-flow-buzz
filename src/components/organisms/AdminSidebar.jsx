import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const AdminSidebar = ({ className }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "BarChart3",
      exact: true
    },
    {
      path: "/admin/products",
      label: "Products",
      icon: "Package",
      exact: false
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: "ShoppingCart",
      exact: false
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: "Users",
      exact: false
    }
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn("fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30", className)}>
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <ApperIcon name="ShoppingBag" size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Market Flow</span>
        </Link>
        <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive(item.path, item.exact)
                  ? "text-primary bg-blue-50 shadow-sm"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              )}
            >
              <ApperIcon name={item.icon} size={20} />
              {item.label}
              {isActive(item.path, item.exact) && (
                <motion.div
                  layoutId="admin-sidebar-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-primary rounded-r"
                />
              )}
            </Link>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;