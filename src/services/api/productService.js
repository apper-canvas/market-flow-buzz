import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy to prevent mutations
let products = [...productsData];

export const productService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProducts = [...products];
    
    // Apply filters
    if (filters.category && filters.category !== "") {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.minRating && filters.minRating > 0) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filters.minRating);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "name":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Default: featured first, then by newest
          filteredProducts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
      }
    }
    
    return [...filteredProducts]; // Return copy to prevent mutations
  },

  async getById(Id) {
    await delay(200);
    
    const product = products.find(p => p.Id === parseInt(Id));
    if (!product) {
      throw new Error("Product not found");
    }
    
    return { ...product }; // Return copy to prevent mutations
  },

  async getFeatured() {
    await delay(250);
    
    const featured = products.filter(p => p.featured);
    return [...featured]; // Return copy to prevent mutations
  },

  async getCategories() {
    await delay(150);
    
    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  },

  async create(productData) {
    await delay(400);
    
    const newProduct = {
      ...productData,
      Id: Math.max(...products.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    return { ...newProduct }; // Return copy to prevent mutations
  },

  async update(Id, productData) {
    await delay(400);
    
    const index = products.findIndex(p => p.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    products[index] = {
      ...products[index],
      ...productData,
      Id: parseInt(Id), // Ensure ID remains integer
      updatedAt: new Date().toISOString()
    };
    
    return { ...products[index] }; // Return copy to prevent mutations
  },

  async delete(Id) {
    await delay(300);
    
    const index = products.findIndex(p => p.Id === parseInt(Id));
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const deleted = products.splice(index, 1)[0];
    return { ...deleted }; // Return copy to prevent mutations
  },

  async updateStock(Id, newStock) {
    await delay(200);
    
    const product = products.find(p => p.Id === parseInt(Id));
    if (!product) {
      throw new Error("Product not found");
    }
    
    product.stock = newStock;
    product.updatedAt = new Date().toISOString();
    
    return { ...product }; // Return copy to prevent mutations
  }
};