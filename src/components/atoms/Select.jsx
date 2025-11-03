import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  label,
  error,
  children,
  className,
  containerClassName,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 border border-gray-300 rounded-lg",
            "bg-white text-gray-900",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-colors duration-200",
            "appearance-none pr-10",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ApperIcon name="ChevronDown" size={20} />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;