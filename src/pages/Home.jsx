import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [featured, allCategories] = await Promise.all([
        productService.getFeatured(),
        productService.getCategories()
      ]);
      
      setFeaturedProducts(featured.slice(0, 8)); // Show max 8 featured products
      setCategories(allCategories.slice(0, 6)); // Show max 6 categories
    } catch (err) {
      console.error("Error loading home data:", err);
      setError("Failed to load home page data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      if (product.stock === 0) {
        toast.error("This product is out of stock");
        return;
      }

await cartService.addItem(product.Id, 1);
      
      // Dispatch custom event to update header cart count
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      }
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const categoryIcons = {
    "Electronics": "Zap",
    "Clothing": "Shirt",
    "Home & Kitchen": "Home",
    "Beauty & Personal Care": "Sparkles",
    "Sports & Fitness": "Dumbbell",
    "Bags & Accessories": "Briefcase"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadHomeData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-primary text-white py-20 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Welcome to Market Flow
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
            >
              Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="xl"
                variant="accent"
                onClick={() => navigate("/products")}
                className="text-lg"
              >
                Shop Now
                <ApperIcon name="ArrowRight" size={24} />
              </Button>
              <Button
size="xl"
                variant="secondary"
                onClick={() => navigate("/deals")}
                className="text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                View Deals
                <ApperIcon name="Tag" size={24} />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products across different categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products?category=${encodeURIComponent(category)}`}>
                  <Card hover className="p-6 text-center group">
                    <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ApperIcon name={categoryIcons[category] || "Package"} size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked products just for you
              </p>
            </div>
            <Link to="/products">
              <Button variant="secondary" size="lg">
                View All
                <ApperIcon name="ArrowRight" size={20} />
              </Button>
            </Link>
          </motion.div>

          <ProductGrid 
            products={featuredProducts}
            loading={false}
            error={null}
          />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <ApperIcon name="Gift" size={20} />
              <span className="font-medium">Special Offer</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Free Shipping on Orders Over $50
            </h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
              Don't miss out on this limited-time offer. Shop now and save on shipping costs!
            </p>
            <Button
              size="xl"
              variant="secondary"
              onClick={() => navigate("/products")}
              className="bg-white text-amber-600 hover:bg-gray-100 text-lg"
            >
              Start Shopping
              <ApperIcon name="ShoppingBag" size={24} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-success text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Truck" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over $50. Fast and reliable delivery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Shield" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                Your payment information is secure with SSL encryption.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-gradient-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="RotateCcw" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                30-Day Returns
              </h3>
              <p className="text-gray-600">
                Not satisfied? Return your purchase within 30 days.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;