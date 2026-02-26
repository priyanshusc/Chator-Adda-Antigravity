import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, PackageSearch, ClipboardList, LogOut } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        // Placeholder logout
        navigate('/login');
    };

    const navLinks = [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Live Orders', path: '/admin/orders', icon: ClipboardList },
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
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-400 hover:text-white"
                    >
                        ☰
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-spicy flex items-center justify-center font-bold shadow-[0_0_10px_rgba(255,92,0,0.4)]">
                            AD
                        </div>
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
