import usersData from "@/services/mockData/users.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy to prevent mutations
let users = [...usersData];

export const userService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredUsers = [...users];
    
    // Apply role filter
    if (filters.role && filters.role !== "") {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by creation date (newest first by default)
    filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return [...filteredUsers]; // Return copy to prevent mutations
  },

  async getById(Id) {
    await delay(200);
    
    const user = users.find(u => u.Id === parseInt(Id));
    if (!user) {
      throw new Error("User not found");
    }
    
    return { ...user, addresses: [...user.addresses] }; // Return copy with copied addresses
  },

  async getByEmail(email) {
    await delay(200);
    
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("User not found");
    }
    
    return { ...user, addresses: [...user.addresses] }; // Return copy with copied addresses
  },

  async create(userData) {
    await delay(400);
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      email: userData.email,
      name: userData.name,
      role: userData.role || "customer",
      addresses: userData.addresses || [],
      phone: userData.phone || "",
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    return { ...newUser, addresses: [...newUser.addresses] }; // Return copy with copied addresses
  },

  async update(Id, userData) {
    await delay(400);
    
    const index = users.findIndex(u => u.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    // Check if email already exists (for other users)
    if (userData.email) {
      const existingUser = users.find(u => u.email === userData.email && u.Id !== parseInt(Id));
      if (existingUser) {
        throw new Error("Email already exists");
      }
    }
    
    users[index] = {
      ...users[index],
      ...userData,
      Id: parseInt(Id), // Ensure ID remains integer
      addresses: userData.addresses ? [...userData.addresses] : [...users[index].addresses]
    };
    
    return { ...users[index], addresses: [...users[index].addresses] }; // Return copy with copied addresses
  },

  async delete(Id) {
    await delay(300);
    
    const index = users.findIndex(u => u.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    const deleted = users.splice(index, 1)[0];
    return { ...deleted, addresses: [...deleted.addresses] }; // Return copy with copied addresses
  },

  async addAddress(Id, addressData) {
    await delay(300);
    
    const user = users.find(u => u.Id === parseInt(Id));
    if (!user) {
      throw new Error("User not found");
    }
    
    const newAddress = {
      id: `addr-${Date.now()}`,
      ...addressData,
      isDefault: user.addresses.length === 0 || addressData.isDefault || false
    };
    
    // If this is set as default, unset others
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(newAddress);
    
    return { ...user, addresses: [...user.addresses] }; // Return copy with copied addresses
  },

  async updateAddress(Id, addressId, addressData) {
    await delay(300);
    
    const user = users.find(u => u.Id === parseInt(Id));
    if (!user) {
      throw new Error("User not found");
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new Error("Address not found");
    }
    
    // If this is set as default, unset others
    if (addressData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...addressData
    };
    
    return { ...user, addresses: [...user.addresses] }; // Return copy with copied addresses
  },

  async deleteAddress(Id, addressId) {
    await delay(300);
    
    const user = users.find(u => u.Id === parseInt(Id));
    if (!user) {
      throw new Error("User not found");
    }
    
    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new Error("Address not found");
    }
    
    const deletedAddress = user.addresses.splice(addressIndex, 1)[0];
    
    // If deleted address was default and there are other addresses, set first one as default
    if (deletedAddress.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    return { ...user, addresses: [...user.addresses] }; // Return copy with copied addresses
  },

  async getStats() {
    await delay(200);
    
    const totalUsers = users.length;
    const customerCount = users.filter(u => u.role === "customer").length;
    const adminCount = users.filter(u => u.role === "admin").length;
    
    // Calculate new users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = users.filter(user => new Date(user.createdAt) > thirtyDaysAgo);
    
    return {
      totalUsers,
      customerCount,
      adminCount,
      newUsersCount: newUsers.length
    };
  }
};