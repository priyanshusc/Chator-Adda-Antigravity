import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, History } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AdminDashboard from './pages/AdminDashboard';
import InventoryManager from './components/InventoryManager';
import OrderManager from './components/OrderManager';
import OrderTracker from './components/OrderTracker';
import OrderHistory from './components/OrderHistory'; // NEW COMPONENT
import { useCart } from './context/CartContext';

const Navbar = ({ onCartClick }) => {
  const { cartItems, activeOrder } = useCart();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  return (
    <nav className="fixed top-0 w-full z-30 bg-dark-bg/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-display font-bold text-gradient flex items-center gap-2">
        <span className="text-2xl">🌶️</span> Chator Adda
      </Link>

      <div className="flex items-center gap-6">
        
        {/* Glow button ONLY shows when there is an active order */}
        {activeOrder && (
          <Link to="/track" className="bg-spicy text-white px-4 py-2 rounded-xl font-bold animate-pulse hover:scale-105 transition-transform">
            Track Order
          </Link>
        )}

        {/* Normal History link */}
        <Link to="/orders" className="text-gray-400 hover:text-spicy-yellow transition-colors font-medium flex items-center gap-2">
          <History size={18} /> History
        </Link>

        <Link to="/menu" className="text-gray-400 hover:text-spicy-yellow transition-colors font-medium flex items-center gap-2">
          <Home size={18} /> Menu
        </Link>
        
        <button
          onClick={onCartClick}
          className="relative text-white hover:text-spicy transition-colors"
        >
          <ShoppingBag size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-spicy-red text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-dark-bg">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="bg-dark-bg min-h-screen text-white font-sans flex flex-col">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-grow">
          <Routes>
            {/* Public/Student Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/track" element={<OrderTracker />} />
            
            {/* NEW: Route for the order history */}
            <Route path="/orders" element={<OrderHistory />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<div className="text-2xl font-bold flex items-center h-full text-gray-400">Welcome to the Admin Panel. Select an option from the sidebar.</div>} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="inventory" element={<InventoryManager />} />
            </Route>
          </Routes>
        </main>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

export default App;