import '@/index.css';
import React, { useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store/store";
import About from "@/pages/About";
import Home from "@/pages/Home";
import Categories from "@/pages/Categories";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Account from "@/pages/Account";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Products from "@/pages/Products";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CartSidebar from "@/components/organisms/CartSidebar";
import Header from "@/components/organisms/Header";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const handleCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-background">
          <Header onCartOpen={handleCartOpen} />
          <main className="pt-16">
<Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/deals" element={<Products />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </main>
<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;