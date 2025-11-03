import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "Eye" }
  ];

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = cartService.getCartItems();
      
      if (items.length === 0) {
        navigate("/products");
        return;
      }

      // Enrich cart items with product details
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const product = await productService.getById(item.productId);
          return {
            ...item,
            productName: product.name,
            productImage: product.images?.[0],
            price: product.price,
            total: product.price * item.quantity
          };
        })
      );
      
      setCartItems(enrichedItems);
    } catch (error) {
      console.error("Error loading cart items:", error);
      toast.error("Failed to load cart items");
      navigate("/cart");
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);

      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        shippingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
        paymentMethod: "Credit Card",
        customerEmail: shippingInfo.email,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`
      };

      const order = await orderService.create(orderData);

      // Clear cart
// Clear cart
      cartService.clearCart();
      
      // Dispatch custom event to update header cart count
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new window.CustomEvent("cartUpdated"));
      }
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.Id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                      step.number <= currentStep
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 text-gray-500"
                    )}
                  >
                    {step.number < currentStep ? (
                      <ApperIcon name="Check" size={20} />
                    ) : (
                      <ApperIcon name={step.icon} size={20} />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={cn(
                      "text-sm font-medium",
                      step.number <= currentStep ? "text-primary" : "text-gray-500"
                    )}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-4 transition-all duration-300",
                      step.number < currentStep ? "bg-primary" : "bg-gray-300"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ApperIcon name="Truck" size={24} />
                        Shipping Information
                      </h2>
                    </div>

                    <Input
                      label="Email Address"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      required
                      icon="Mail"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        required
                        icon="User"
                      />
                      <Input
                        label="Last Name"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        required
                        icon="User"
                      />
                    </div>

                    <Input
                      label="Address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      required
                      icon="MapPin"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        required
                      />
                      <Select
                        label="State"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </Select>
                      <Input
                        label="ZIP Code"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleNext} disabled={!shippingInfo.email || !shippingInfo.firstName}>
                        Continue to Payment
                        <ApperIcon name="ArrowRight" size={20} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ApperIcon name="CreditCard" size={24} />
                        Payment Information
                      </h2>
                    </div>

                    <Input
                      label="Cardholder Name"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                      required
                      icon="User"
                    />

                    <Input
                      label="Card Number"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      required
                      icon="CreditCard"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        required
                        icon="Calendar"
                      />
                      <Input
                        label="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                        placeholder="123"
                        required
                        icon="Shield"
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button variant="secondary" onClick={handleBack}>
                        <ApperIcon name="ArrowLeft" size={20} />
                        Back to Shipping
                      </Button>
                      <Button onClick={handleNext} disabled={!paymentInfo.cardNumber || !paymentInfo.cvv}>
                        Review Order
                        <ApperIcon name="ArrowRight" size={20} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ApperIcon name="Eye" size={24} />
                        Review Your Order
                      </h2>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="flex items-center gap-4 py-4 border-b border-gray-200">
                          <img
                            src={item.productImage || "/api/placeholder/60/60"}
                            alt={item.productName}
                            className="w-15 h-15 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.productName}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">${item.total.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="secondary" onClick={handleBack}>
                        <ApperIcon name="ArrowLeft" size={20} />
                        Back to Payment
                      </Button>
                      <Button 
                        onClick={handleSubmitOrder}
                        loading={loading}
                        disabled={loading}
                        size="lg"
                      >
                        {loading ? "Processing..." : "Place Order"}
                        <ApperIcon name="CheckCircle" size={20} />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {subtotal < 50 && (
                <p className="text-xs text-gray-600 mb-4">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <div className="text-xs text-gray-500">
                <p className="flex items-center gap-1 mb-1">
                  <ApperIcon name="Shield" size={12} />
                  Secure checkout with SSL encryption
                </p>
                <p className="flex items-center gap-1">
                  <ApperIcon name="RotateCcw" size={12} />
                  30-day return policy
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;