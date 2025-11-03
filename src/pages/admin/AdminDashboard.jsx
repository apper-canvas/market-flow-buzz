import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";
import { productService } from "@/services/api/productService";
import { userService } from "@/services/api/userService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [orderStats, userStats, orders, products] = await Promise.all([
        orderService.getStats(),
        userService.getStats(),
        orderService.getAll(),
        productService.getAll()
      ]);

      // Combine stats
      const combinedStats = {
        ...orderStats,
        ...userStats,
        totalProducts: products.length,
        lowStockProducts: products.filter(p => p.stock <= 10).length
      };

      setStats(combinedStats);
      setRecentOrders(orders.slice(0, 5)); // Get 5 most recent orders
      setLowStockProducts(products.filter(p => p.stock <= 10).slice(0, 5)); // Get 5 low stock products
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
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

  if (loading) {
    return (
      <div className="p-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">
                ${stats?.totalRevenue?.toLocaleString() || "0"}
              </p>
              <p className="text-green-500 text-sm mt-1">
                <ApperIcon name="TrendingUp" size={14} className="inline mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="bg-gradient-primary text-white p-3 rounded-lg">
              <ApperIcon name="DollarSign" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats?.totalOrders || 0}
              </p>
              <p className="text-green-500 text-sm mt-1">
                <ApperIcon name="TrendingUp" size={14} className="inline mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="bg-gradient-accent text-white p-3 rounded-lg">
              <ApperIcon name="ShoppingCart" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats?.customerCount || 0}
              </p>
              <p className="text-green-500 text-sm mt-1">
                <ApperIcon name="TrendingUp" size={14} className="inline mr-1" />
                +15.1% from last month
              </p>
            </div>
            <div className="bg-gradient-success text-white p-3 rounded-lg">
              <ApperIcon name="Users" size={24} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Order Value</p>
              <p className="text-3xl font-bold text-gray-800">
                ${stats?.averageOrderValue?.toFixed(2) || "0.00"}
              </p>
              <p className="text-green-500 text-sm mt-1">
                <ApperIcon name="TrendingUp" size={14} className="inline mr-1" />
                +3.8% from last month
              </p>
            </div>
            <div className="bg-purple-500 text-white p-3 rounded-lg">
              <ApperIcon name="BarChart3" size={24} />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <Badge variant="primary" size="sm">
                {recentOrders.length} orders
              </Badge>
            </div>

            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent orders</p>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        <ApperIcon name="Package" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Order #{order.Id}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customerName} • {format(new Date(order.orderDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(order.status)} size="sm">
                        {order.status}
                      </Badge>
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Low Stock Alert</h2>
              <Badge variant="warning" size="sm">
                {stats?.lowStockProducts || 0} products
              </Badge>
            </div>

            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">All products are well stocked</p>
              ) : (
                lowStockProducts.map((product) => (
                  <div
                    key={product.Id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || "/api/placeholder/40/40"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 truncate max-w-[200px]">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={product.stock === 0 ? "error" : "warning"} size="sm">
                        {product.stock} left
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <ApperIcon name="Plus" size={20} />
              </div>
              <span className="font-medium text-gray-800">Add Product</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="bg-green-500 text-white p-2 rounded-lg">
                <ApperIcon name="Package" size={20} />
              </div>
              <span className="font-medium text-gray-800">Process Orders</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="bg-purple-500 text-white p-2 rounded-lg">
                <ApperIcon name="Users" size={20} />
              </div>
              <span className="font-medium text-gray-800">Manage Users</span>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="bg-orange-500 text-white p-2 rounded-lg">
                <ApperIcon name="BarChart3" size={20} />
              </div>
              <span className="font-medium text-gray-800">View Reports</span>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;