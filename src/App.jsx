import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './store/store';
import Header from './components/organisms/Header';
import CartSidebar from '@/components/organisms/CartSidebar';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import About from '@/pages/About';
import Account from '@/pages/Account';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import '@/index.css';

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