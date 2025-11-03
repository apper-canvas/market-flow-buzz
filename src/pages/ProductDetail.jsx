import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getById(id);
      setProduct(productData);

      // Load related products from same category
      const allProducts = await productService.getAll({ 
        category: productData.category 
      });
      const related = allProducts
        .filter(p => p.Id !== productData.Id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      setAddingToCart(true);
await cartService.addItem(product.Id, quantity);
      
      // Dispatch custom event to update header cart count
      window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (!addingToCart) {
      navigate("/checkout");
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const discountPercentage = product?.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="bg-gray-200 w-full h-96 rounded-lg mb-4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 w-full h-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error 
            message={error} 
            onRetry={loadProduct}
          />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-600 mb-8"
        >
          <button onClick={() => navigate("/")} className="hover:text-primary">
            Home
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button onClick={() => navigate("/products")} className="hover:text-primary">
            Products
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <button 
            onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}
            className="hover:text-primary"
          >
            {product.category}
          </button>
          <ApperIcon name="ChevronRight" size={16} />
          <span className="text-gray-800 font-medium truncate">
            {product.name}
          </span>
        </motion.nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-6">
              <Card className="overflow-hidden mb-4">
                <img
                  src={product.images?.[selectedImageIndex] || "/api/placeholder/600/600"}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                {product.featured && (
                  <Badge 
                    variant="accent" 
                    className="absolute top-4 left-4"
                  >
                    Featured
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge 
                    variant="error" 
                    className="absolute top-4 right-4"
                  >
                    -{discountPercentage}%
                  </Badge>
                )}
              </Card>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "border-2 rounded-lg overflow-hidden transition-all",
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="primary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon
                        key={i}
                        name="Star"
                        size={20}
                        className={cn(
                          i < Math.floor(product.rating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compareAtPrice}
                  </span>
                  <Badge variant="success" size="sm">
                    Save ${(product.compareAtPrice - product.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <ApperIcon name="CheckCircle" size={20} className="text-green-500" />
                  <span className="text-green-600 font-medium">In Stock</span>
                  {product.stock <= 10 && (
                    <Badge variant="warning" size="sm">
                      Only {product.stock} left!
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <ApperIcon name="XCircle" size={20} className="text-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <Card className="p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className="ml-2 font-medium">{product.stock} units</span>
                </div>
                {product.reviewCount && (
                  <div>
                    <span className="text-gray-600">Reviews:</span>
                    <span className="ml-2 font-medium">{product.reviewCount}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <Card className="p-6 border-2 border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 p-0"
                    >
                      <ApperIcon name="Minus" size={16} />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 p-0"
                    >
                      <ApperIcon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    loading={addingToCart}
                    disabled={addingToCart}
                    className="flex-1"
                    size="lg"
                  >
                    <ApperIcon name="ShoppingCart" size={20} />
                    Add to Cart
                  </Button>
                  <Button
                    variant="accent"
                    onClick={handleBuyNow}
                    className="flex-1"
                    size="lg"
                  >
                    <ApperIcon name="Zap" size={20} />
                    Buy Now
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Truck" size={16} />
                    Free shipping over $50
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="RotateCcw" size={16} />
                    30-day returns
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Shield" size={16} />
                    Secure checkout
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.Id}
                  hover
                  className="cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/products/${relatedProduct.Id}`)}
                >
                  <img
                    src={relatedProduct.images?.[0] || "/api/placeholder/300/300"}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ${relatedProduct.price}
                      </span>
                      {relatedProduct.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${relatedProduct.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;