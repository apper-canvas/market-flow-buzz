import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    { id: "orders", label: "Order History", icon: "Package" },
    { id: "profile", label: "Profile", icon: "User" },
    { id: "addresses", label: "Addresses", icon: "MapPin" },
    { id: "settings", label: "Settings", icon: "Settings" }
  ];

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would filter by current user
      const ordersData = await orderService.getAll();
      setOrders(ordersData);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "warning",
      processing: "primary",
      shipped: "info",
      delivered: "success"
    };
    return statusMap[status] || "default";
  };

  const renderOrderHistory = () => {
    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadOrders} />;
    if (orders.length === 0) {
      return (
        <Empty
          icon="Package"
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see your order history here."
          actionLabel="Start Shopping"
          onAction={() => window.location.href = "/products"}
        />
      );
    }

    return (
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.Id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.Id}
                  </h3>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Placed on {format(new Date(order.orderDate), "MMMM d, yyyy")}
                </p>
                {order.estimatedDelivery && (
                  <p className="text-sm text-gray-500">
                    Estimated delivery: {format(new Date(order.estimatedDelivery), "MMMM d, yyyy")}
                  </p>
                )}
              </div>
              <div className="mt-4 lg:mt-0 text-right">
                <p className="text-2xl font-bold text-primary">
                  ${order.total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img
                      src={item.productImage || "/api/placeholder/60/60"}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      ${item.total.toFixed(2)}
                    </p>
                  </div>
                ))}
                
                {order.items.length > 3 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedOrder(order)}
                className="flex-1"
              >
                <ApperIcon name="Eye" size={16} />
                View Details
              </Button>
              {order.status === "delivered" && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <ApperIcon name="RotateCcw" size={16} />
                  Return Items
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                <ApperIcon name="Download" size={16} />
                Download Invoice
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderProfile = () => (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center">
          <ApperIcon name="User" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
          <p className="text-gray-600">john.doe@example.com</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value="john.doe@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Account Settings</h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Edit" size={16} />
              Edit Profile
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Lock" size={16} />
              Change Password
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Bell" size={16} />
              Notification Settings
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Saved Addresses</h2>
        <Button>
          <ApperIcon name="Plus" size={16} />
          Add New Address
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Home</h3>
            <Badge variant="primary" size="sm">Default</Badge>
          </div>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">John Doe</p>
            <p>123 Main Street</p>
            <p>San Francisco, CA 94105</p>
            <p>United States</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Edit" size={14} />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
              <ApperIcon name="Trash2" size={14} />
              Delete
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Work</h3>
          </div>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">John Doe</p>
            <p>456 Business Ave</p>
            <p>San Francisco, CA 94102</p>
            <p>United States</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Edit" size={14} />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
              <ApperIcon name="Trash2" size={14} />
              Delete
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-700">Order updates and shipping notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-700">Product recommendations and deals</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-gray-700">Marketing communications</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Privacy</h3>
          <div className="space-y-3">
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Download" size={16} />
              Download My Data
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <ApperIcon name="Shield" size={16} />
              Privacy Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700">
              <ApperIcon name="Trash2" size={16} />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your orders, profile, and account settings</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-gray-600 border-transparent hover:text-primary hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "orders" && renderOrderHistory()}
          {activeTab === "profile" && renderProfile()}
          {activeTab === "addresses" && renderAddresses()}
          {activeTab === "settings" && renderSettings()}
        </motion.div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order #{selectedOrder.Id}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order Date:</span>
                        <p className="font-medium">
                          {format(new Date(selectedOrder.orderDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={getStatusColor(selectedOrder.status)} className="ml-2">
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Method:</span>
                        <p className="font-medium">{selectedOrder.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <p className="font-medium text-primary">${selectedOrder.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                          <img
                            src={item.productImage || "/api/placeholder/60/60"}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.productName}</h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            ${item.total.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
                    <div className="text-gray-600">
                      <p className="font-medium text-gray-800">{selectedOrder.customerName}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;