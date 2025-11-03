import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      <div className="text-red-500 mb-6">
        <ApperIcon name="AlertCircle" size={64} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors btn-scale flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={20} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;