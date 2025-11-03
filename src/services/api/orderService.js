import ordersData from "@/services/mockData/orders.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy to prevent mutations
let orders = [...ordersData];

export const orderService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredOrders = [...orders];
    
    // Apply status filter
    if (filters.status && filters.status !== "") {
      filteredOrders = filteredOrders.filter(o => o.status === filters.status);
    }
    
    // Apply date filter
    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(o => 
        new Date(o.orderDate) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(o => 
        new Date(o.orderDate) <= new Date(filters.dateTo)
      );
    }
    
    // Apply customer filter
    if (filters.customer) {
      const searchTerm = filters.customer.toLowerCase();
      filteredOrders = filteredOrders.filter(o => 
        o.customerName.toLowerCase().includes(searchTerm) ||
        o.customerEmail.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by date (newest first by default)
    filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    return [...filteredOrders]; // Return copy to prevent mutations
  },

  async getById(Id) {
    await delay(200);
    
    const order = orders.find(o => o.Id === parseInt(Id));
    if (!order) {
      throw new Error("Order not found");
    }
    
    return { ...order }; // Return copy to prevent mutations
  },

  async getByUserId(userId) {
    await delay(250);
    
    const userOrders = orders.filter(o => o.userId === userId);
    return [...userOrders]; // Return copy to prevent mutations
  },

  async create(orderData) {
    await delay(500);
    
    const subtotal = orderData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shipping;
    
    const newOrder = {
      Id: Math.max(...orders.map(o => o.Id)) + 1,
      userId: `user-${Date.now()}`, // Generate user ID
      items: [...orderData.items], // Copy items array
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      status: "pending",
      shippingAddress: { ...orderData.shippingAddress }, // Copy address
      paymentMethod: orderData.paymentMethod || "Credit Card",
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName
    };
    
    orders.push(newOrder);
    return { ...newOrder }; // Return copy to prevent mutations
  },

  async updateStatus(Id, status) {
    await delay(300);
    
    const order = orders.find(o => o.Id === parseInt(Id));
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status");
    }
    
    order.status = status;
    
    // Update estimated delivery based on status
    if (status === "shipped" && order.status !== "shipped") {
      order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days from now
    }
    
    return { ...order }; // Return copy to prevent mutations
  },

  async delete(Id) {
    await delay(300);
    
    const index = orders.findIndex(o => o.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    const deleted = orders.splice(index, 1)[0];
    return { ...deleted }; // Return copy to prevent mutations
  },

  async getStats() {
    await delay(200);
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const statusCounts = orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {});
    
    // Calculate recent orders (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(order => new Date(order.orderDate) > sevenDaysAgo);
    
    return {
      totalOrders,
      totalRevenue,
      statusCounts,
      recentOrdersCount: recentOrders.length,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  }
};