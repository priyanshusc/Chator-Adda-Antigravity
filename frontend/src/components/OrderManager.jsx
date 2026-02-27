import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Flame, User, PackageCheck } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const STATUS_COLORS = {
    Pending: 'bg-red-500/20 text-red-500 border-red-500/30',
    Preparing: 'bg-spicy-yellow/20 text-spicy-yellow border-spicy-yellow/30',
    Ready: 'bg-green-500/20 text-green-400 border-green-500/30',
    'Picked Up': 'bg-blue-500/20 text-blue-400 border-blue-500/30' // NEW COLOR
};

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const socket = useSocket();

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

    useEffect(() => {
        if (!socket) return;
        socket.on('new_order', (order) => {
            console.log("Received new order:", order);
            setOrders(prev => [order, ...prev]);
        });
        socket.on('admin_order_update', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });
        return () => {
            socket.off('new_order');
            socket.off('admin_order_update');
        };
    }, [socket]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                // Update your local admin state so the UI changes immediately
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: updatedOrder.status } : order
                ));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }

        if (socket) {
            console.log("Admin emitting status update for:", orderId);
            socket.emit('update_order_status', {
                orderId: orderId,
                status: newStatus
            });
        }
    };

    const getStatusActionButtons = (order) => {
        if (order.status === 'Pending') {
            return (
                <button
                    onClick={() => updateStatus(order._id, 'Preparing')}
                    className="w-full py-2 bg-spicy/20 hover:bg-spicy/40 text-spicy border border-spicy/50 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                    <Flame size={18} /> Start Preparing
                </button>
            );
        }
        if (order.status === 'Preparing') {
            return (
                <button
                    onClick={() => updateStatus(order._id, 'Ready')}
                    className="w-full py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/50 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                    <CheckCircle2 size={18} /> Mark as Ready
                </button>
            );
        }
        if (order.status === 'Ready') {
            // NEW BUTTON: Mark as Picked Up
            return (
                <button
                    onClick={() => updateStatus(order._id, 'Picked Up')}
                    className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/50 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                    <PackageCheck size={18} /> Mark as Picked Up
                </button>
            );
        }
        if (order.status === 'Picked Up') {
            // FINAL BUTTON: Archive and clear from screen
            return (
                <button
                    onClick={() => {
                        updateStatus(order._id, 'Completed');
                        setOrders(orders.filter(o => o._id !== order._id));
                    }}
                    className="w-full py-2 bg-dark-surface hover:bg-gray-800 text-gray-400 border border-gray-700 rounded-lg font-semibold transition-colors"
                >
                    Archive (Completed)
                </button>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Live Order Feed</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Receiving real-time updates
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {orders.filter(o => o.status !== 'Completed').map((order) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={order._id}
                            className="glass-card flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-800 bg-dark-surface/30 flex justify-between items-center">
                                <span className="font-bold font-display text-white">#{order._id.substring(0, 8)}...</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="p-5 flex-1">
                                <div className="flex items-center gap-3 text-gray-400 text-sm mb-4">
                                    <User size={16} /> {order.user?.name || "Student"}
                                    <span className="mx-1">•</span>
                                    <span className="text-gray-400">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just Now"}
                                    </span>
                                </div>

                                {order.transactionId && (
                                    <div className="mb-4 text-xs bg-dark-bg p-2 rounded border border-gray-800 text-gray-400 font-mono">
                                        TXN: <span className="text-white">{order.transactionId}</span>
                                    </div>
                                )}

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
                                    {getStatusActionButtons(order)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {orders.filter(o => o.status !== 'Completed').length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-dark-surface mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">All caught up!</h3>
                        <p>No active orders in the queue.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManager;