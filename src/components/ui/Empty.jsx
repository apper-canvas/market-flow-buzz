import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Try adjusting your search or filters",
  actionLabel = "Browse Products",
  onAction,
  icon = "Package",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      <div className="text-gray-400 mb-6">
        <ApperIcon name={icon} size={64} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors btn-scale flex items-center gap-2"
        >
          <ApperIcon name="ArrowRight" size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;