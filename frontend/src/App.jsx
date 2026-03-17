import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ShoppingBag, Home, History, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AdminDashboard from './pages/AdminDashboard';
import InventoryManager from './components/InventoryManager';
import OrderManager from './components/OrderManager';
import AdminCompletedOrders from './components/AdminCompletedOrders';
import OrderHistory from './components/OrderHistory';
import { useCart } from './context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';

// --- ROUTE GUARDS ---
// 1. Protects routes that require ANY logged-in user (like their Order History)
const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo ? children : <Navigate to="/login" />;
};

// 2. Protects Admin routes specifically
const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // Ensure the user exists AND has admin privileges
  if (userInfo && (userInfo.isAdmin === true || userInfo.role === 'admin')) {
    return children;
  }
  return <Navigate to="/login" />;
};

// 3. Redirects logged-in users away from public auth pages
const PublicRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  // If user data exists, redirect them to the menu instead of showing login/register
  return userInfo ? <Navigate to="/menu" replace /> : children;
};

const Navbar = ({ onCartClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { cartItems, clearCart } = useCart();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    clearCart();
    navigate('/login');
    setIsProfileOpen(false);
  };

  if (isAuthPage || isAdminPage) return null;

  return (
    <nav className="fixed top-0 w-full z-30 bg-dark-bg/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-display font-bold text-gradient flex items-center gap-2">
        <span className="text-2xl">🌶️</span> LiveBite
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/menu" className="text-gray-400 hover:text-spicy-yellow transition-colors font-medium flex items-center gap-2">
          <Home size={18} /> Menu
        </Link>

        <Link to="/orders" className="text-gray-400 hover:text-spicy-yellow transition-colors font-medium flex items-center gap-2">
          <History size={18} /> Orders
        </Link>

        <button
          onClick={onCartClick}
          className="relative text-white hover:text-spicy transition-colors"
        >
          <ShoppingBag size={24} />
          {totalItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-spicy-red text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-dark-bg">
              {totalItemCount}
            </span>
          )}
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-800 transition-all border border-transparent hover:border-gray-700"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-spicy to-spicy-red flex items-center justify-center text-white shadow-lg overflow-hidden border border-white/10">
              {userInfo?.profileImg ? (
                <img src={userInfo.profileImg} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-dark-surface rounded-2xl border border-gray-800 shadow-2xl overflow-hidden py-2"
              >
                <div className="px-4 py-3 border-b border-gray-600 mb-2">
                  <p className="text-sm font-bold text-white truncate">{userInfo?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{userInfo?.email}</p>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-spicy-yellow hover:bg-gray-800/50 transition-all">
                  <User size={16} /> Profile
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-spicy-yellow hover:bg-gray-800/50 transition-all">
                  <Settings size={16} /> Settings
                </button>

                <div className="h-px bg-gray-800 mx-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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

            <Route path="/" element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } />

            {/* Wrapped Auth Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            <Route path="/menu" element={<Menu />} />

            {/* Protected Student Routes */}
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }>
              <Route index element={<div className="text-2xl font-bold flex items-center h-full text-gray-400">Welcome to the Admin Panel. Select an option from the sidebar.</div>} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="completed" element={<AdminCompletedOrders />} />
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