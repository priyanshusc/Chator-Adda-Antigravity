import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, History } from 'lucide-react';

const AdminCompletedOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.reverse());
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        fetchOrders();
    }, []);

    // ONLY show orders that are officially Completed
    const completedOrders = orders.filter(o => o.status === 'Completed');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Completed Orders</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <History size={16} /> Past order history
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {completedOrders.map((order) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={order._id}
                            className="glass-card flex flex-col overflow-hidden opacity-80"
                        >
                            <div className="p-4 border-b border-gray-800 bg-dark-surface/30 flex justify-between items-center">
                                <span className="font-bold font-display text-white">#{order._id.substring(0, 8)}...</span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-800 text-gray-400 border-gray-700">
                                    Completed
                                </span>
                            </div>

                            <div className="p-5 flex-1">
                                <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
                                    <User size={16} /> {order.user?.name || "Student"}
                                    <span className="mx-1">•</span>
                                    <span className="text-gray-400">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Past"}
                                    </span>
                                </div>

                                <ul className="space-y-2 mb-6">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-start">
                                            <span className="text-gray-300">
                                                <span className="text-spicy-yellow font-bold mr-2">{item.quantity}x</span>
                                                {item.menuItem?.name || "Menu Item"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between items-center font-bold text-lg mb-6 pt-4 border-t border-gray-800">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-spicy-yellow">₹{order.totalAmount}</span>
                                </div>

                                <div className="mt-auto">
                                    {/* The button does absolutely nothing! */}
                                    <button
                                        disabled
                                        className="w-full py-2 bg-dark-surface text-gray-500 border border-gray-800 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} /> Completed
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {completedOrders.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                        <History size={32} className="mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No History Yet</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCompletedOrders;