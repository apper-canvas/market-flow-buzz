import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { productService } from '@/services/api/productService';

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const products = await productService.getAll();
      
      // Extract unique categories with counts
      const categoryMap = {};
      products.forEach(product => {
        if (product.category) {
          if (categoryMap[product.category]) {
            categoryMap[product.category].count++;
          } else {
            categoryMap[product.category] = {
              name: product.category,
              count: 1,
              image: product.image, // Use first product image as category image
              description: getCategoryDescription(product.category)
            };
          }
        }
      });

      setCategories(Object.values(categoryMap));
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Electronics': 'Discover the latest in technology and gadgets',
      'Clothing': 'Fashion and apparel for every style',
      'Books': 'Expand your knowledge with our book collection',
      'Home & Garden': 'Everything you need for your home and garden',
      'Sports & Outdoors': 'Gear up for your active lifestyle',
      'Health & Beauty': 'Products for your health and wellness',
      'Toys & Games': 'Fun and educational toys for all ages',
      'Automotive': 'Parts and accessories for your vehicle'
    };
    return descriptions[category] || `Browse our ${category.toLowerCase()} collection`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': 'Laptop',
      'Clothing': 'Shirt',
      'Books': 'Book',
      'Home & Garden': 'Home',
      'Sports & Outdoors': 'Bike',
      'Health & Beauty': 'Heart',
      'Toys & Games': 'Gamepad2',
      'Automotive': 'Car'
    };
    return icons[category] || 'Package';
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchCategories} />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shop by Category
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore our wide range of products organized by category
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer card-hover overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div 
                  className="relative h-48 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-primary/30 group-hover:text-primary/50 transition-colors duration-300">
                      <ApperIcon name={getCategoryIcon(category.name)} size={64} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  
                  {/* Category Count Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {category.count} items
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <Button 
                    onClick={() => handleCategoryClick(category.name)}
                    className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity duration-300"
                    size="sm"
                  >
                    Browse Category
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <ApperIcon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-600 mb-6">There are no product categories available at the moment.</p>
            <Button 
              onClick={() => navigate('/products')}
              variant="outline"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;