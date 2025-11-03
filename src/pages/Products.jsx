import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
// Check if this is the deals page
  const isDealsPage = location.pathname === '/deals';

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    sortBy: searchParams.get("sort") || "featured",
    deals: isDealsPage
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  useEffect(() => {
    loadCategories();
  }, []);
useEffect(() => {
    loadProducts();
  }, [filters]);

  useEffect(() => {
    // Update filters from URL params and page location
    const newFilters = {
      ...filters,
      category: searchParams.get("category") || "",
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sort") || "featured",
      deals: location.pathname === '/deals'
    };
    setFilters(newFilters);
  }, [searchParams, location.pathname]);

  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let productsData = await productService.getAll(filters);
      
      // If deals filter is active, filter for products with discounts or special pricing
      if (filters.deals) {
        productsData = productsData.filter(product => 
          product.discountPrice || 
          product.isOnSale || 
          product.discount > 0 ||
          (product.originalPrice && product.price < product.originalPrice)
        );
      }
      
      setProducts(productsData);

      // Calculate actual price range from products
      if (productsData.length > 0) {
        const prices = productsData.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ 
          min: Math.floor(minPrice), 
          max: Math.ceil(maxPrice) 
        });
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.sortBy && newFilters.sortBy !== "featured") params.set("sort", newFilters.sortBy);
    
    setSearchParams(params);
  };

  const handleSortChange = (sortBy) => {
    handleFiltersChange({ ...filters, sortBy });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: "",
      search: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
      sortBy: "featured"
    };
    handleFiltersChange(clearedFilters);
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "name", label: "Name: A to Z" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
<h1 className="text-3xl font-bold text-gray-800 mb-2">
                {filters.deals ? "Special Deals" :
                 filters.search ? `Search: "${filters.search}"` : 
                 filters.category ? `${filters.category}` : "All Products"}
              </h1>
              <p className="text-gray-600">
                {loading ? "Loading..." : `${products.length} products found`}
              </p>
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <Select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="min-w-[200px]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <ApperIcon name="Grid3X3" size={20} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <ApperIcon name="List" size={20} />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center justify-between gap-4 mb-6">
            <Button
              variant="secondary"
              onClick={() => setIsFilterOpen(true)}
              className="flex-1"
            >
              <ApperIcon name="Filter" size={20} />
              Filters
            </Button>

            <Select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.search || filters.minRating > 0) && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, category: "" })}
                    className="hover:text-blue-900"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </span>
              )}
              
              {filters.search && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Search: {filters.search}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, search: "" })}
                    className="hover:text-blue-900"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </span>
              )}
              
              {filters.minRating > 0 && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Rating: {filters.minRating}+ stars
                  <button
                    onClick={() => handleFiltersChange({ ...filters, minRating: 0 })}
                    className="hover:text-blue-900"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </span>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              priceRange={priceRange}
            />
          </div>

          {/* Mobile Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            priceRange={priceRange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            className="lg:hidden"
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <Loading />
            ) : error ? (
              <Error message={error} onRetry={loadProducts} />
            ) : products.length === 0 ? (
              <Empty
                icon="Search"
                title="No products found"
                description="Try adjusting your search terms or filters to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={handleClearFilters}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <ProductGrid 
                  products={products}
                  loading={false}
                  error={null}
                  className={cn(
                    viewMode === "list" ? "grid-cols-1 gap-4" : ""
                  )}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;