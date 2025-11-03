import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ 
  filters,
  onFiltersChange,
  categories = [],
  priceRange = { min: 0, max: 1000 },
  className,
  isOpen,
  onClose,
  ...props 
}) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    category: "",
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    minRating: 0
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0
    };
    setLocalFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const activeFiltersCount = Object.values(localFilters).filter(value => 
    value !== "" && value !== priceRange.min && value !== priceRange.max && value !== 0
  ).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white lg:bg-transparent",
          "transform transition-transform duration-300 lg:transform-none",
          "overflow-y-auto lg:overflow-visible",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
        {...props}
      >
        <Card className="lg:sticky lg:top-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ApperIcon name="Filter" size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm">
                  {activeFiltersCount}
                </Badge>
              )}
            </h3>
            
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Category</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={localFilters.category === ""}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="mr-2 text-blue-600"
                  />
                  All Categories
                </label>
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={localFilters.category === category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min</label>
                    <input
                      type="number"
                      value={localFilters.minPrice}
                      onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
                      min={priceRange.min}
                      max={priceRange.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max</label>
                    <input
                      type="number"
                      value={localFilters.maxPrice}
                      onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                      min={priceRange.min}
                      max={priceRange.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={localFilters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={localFilters.minRating === rating}
                      onChange={(e) => handleFilterChange("minRating", Number(e.target.value))}
                      className="mr-2 text-blue-600"
                    />
                    <div className="flex items-center gap-1">
                      {rating === 0 ? "All Ratings" : (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <ApperIcon
                              key={i}
                              name="Star"
                              size={16}
                              className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">& up</span>
                        </>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default FilterSidebar;