import React, { useState, useRef, useEffect } from 'react'; // Added useRef, useEffect
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { LayoutDashboard, PackageSearch, ClipboardList, LogOut, History, User, Settings, ChevronDown } from 'lucide-react'; // Added User, Settings, ChevronDown
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sling as Hamburger } from "hamburger-react";


const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- NEW: Dropdown State & Refs ---
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

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
    // ----------------------------------

    const navLinks = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Live Orders', path: '/admin/orders', icon: ClipboardList },
        { name: 'Completed Orders', path: '/admin/completed', icon: History },
        { name: 'Inventory', path: '/admin/inventory', icon: PackageSearch },
    ];

    return (
        <div className="min-h-screen bg-dark-bg flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 256 : 80 }}
                className="bg-dark-surface border-r border-gray-800 flex flex-col h-screen sticky top-0 z-40 transition-all overflow-hidden"
            >
                <div className="h-20 flex items-center justify-center border-b border-gray-800">
                    <Link to="/admin" className="flex items-center gap-2">
                        <span className="text-2xl">🌶️</span>
                        {isSidebarOpen && <span className="font-display font-bold text-gradient text-xl whitespace-nowrap">Admin Panel</span>}
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive
                                    ? 'bg-spicy/20 text-spicy-yellow border border-spicy/30 shadow-[0_0_15px_rgba(255,92,0,0.1)]'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                title={link.name}
                            >
                                <Icon size={20} className={isActive ? 'text-spicy' : ''} />
                                {isSidebarOpen && <span className="font-medium">{link.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Hub */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-spicy/5 rounded-full blur-[150px] pointer-events-none" />

                <header className="h-20 border-b border-gray-800 bg-dark-bg/80 backdrop-blur-md px-8 flex items-center justify-between z-30">

                    <Hamburger className="cursor-pointer"
                        toggled={isSidebarOpen}
                        toggle={setIsSidebarOpen}
                        size={20}
                    />

                    {/* --- UPDATED: Profile Dropdown --- */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-700/50"
                        >
                            <div className="w-10 h-10 rounded-full bg-spicy flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(255,92,0,0.4)] border border-white/10 overflow-hidden">
                                {userInfo?.profileImg ? (
                                    <img src={userInfo.profileImg} alt="Admin" className="w-full h-full object-cover" />
                                ) : (
                                    "AD"
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
                                        <p className="text-sm font-bold text-white truncate">{userInfo?.name || 'Super Admin'}</p>
                                        <p className="text-[10px] text-gray-500 truncate uppercase tracking-widest">{userInfo?.role}</p>
                                    </div>

                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-spicy-yellow hover:bg-gray-800/50 transition-all">
                                        <User size={16} /> Profile
                                    </button>

                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-spicy-yellow hover:bg-gray-800/50 transition-all">
                                        <Settings size={16} /> Settings
                                    </button>

                                    <div className="h-px bg-gray-800 mx-2"></div>

                                    {/* <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button> */}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 z-10 w-full max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;