import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderData = await orderService.getById(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error("Error loading order:", err);
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error 
            message={error} 
            onRetry={loadOrder}
          />
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="CheckCircle" size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for your purchase! Your order has been successfully placed and is being processed.
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Order #{order.Id}
                </h2>
                <p className="text-gray-600">
                  Placed on {format(new Date(order.orderDate), "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge variant={order.status} size="lg">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <img
                      src={item.productImage || "/api/placeholder/80/80"}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Shipping & Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Shipping Address */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ApperIcon name="Truck" size={20} />
              Shipping Address
            </h3>
            <div className="text-gray-600">
              <p className="font-medium text-gray-800">{order.customerName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
            {order.estimatedDelivery && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Estimated Delivery: {format(new Date(order.estimatedDelivery), "MMMM d, yyyy")}
                </p>
              </div>
            )}
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ApperIcon name="CreditCard" size={20} />
              Payment Method
            </h3>
            <div className="text-gray-600">
              <p className="font-medium text-gray-800">{order.paymentMethod}</p>
              <p>Payment processed successfully</p>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Payment confirmed
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate("/products")}
            size="lg"
          >
            <ApperIcon name="ShoppingBag" size={20} />
            Continue Shopping
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/account/orders")}
            size="lg"
          >
            <ApperIcon name="Package" size={20} />
            View All Orders
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.print()}
            size="lg"
          >
            <ApperIcon name="Printer" size={20} />
            Print Receipt
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-gray-600"
        >
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <ApperIcon name="Package" size={24} />
                </div>
                <p className="font-medium text-gray-800 mb-1">Order Processing</p>
                <p>We're preparing your items for shipment</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <ApperIcon name="Truck" size={24} />
                </div>
                <p className="font-medium text-gray-800 mb-1">Shipping Updates</p>
                <p>You'll receive tracking information via email</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                  <ApperIcon name="Home" size={24} />
                </div>
                <p className="font-medium text-gray-800 mb-1">Delivery</p>
                <p>Your order will arrive by the estimated date</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;