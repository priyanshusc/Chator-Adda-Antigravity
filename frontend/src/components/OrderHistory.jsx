import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Clock, Flame, CheckCircle2, ShoppingBag, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

const STATUS_COLORS = {
    Pending: 'bg-red-500/20 text-red-500 border-red-500/30',
    Preparing: 'bg-spicy-yellow/20 text-spicy-yellow border-spicy-yellow/30',
    Ready: 'bg-green-500/20 text-green-400 border-green-500/30',
    'Picked Up': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Completed: 'bg-gray-800 text-gray-400 border-gray-700'
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const socket = useSocket();

    // 1. Fetch Orders on Mount
    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                // CHANGE THIS LINE: Add /myorders to the end of the URL
                const res = await fetch('/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.reverse());
                } else {
                    console.error("Failed to fetch history. Check if route exists!");
                }
            } catch (error) {
                console.error("Error loading order history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    // 2. Real-Time Socket Connections
    useEffect(() => {
        if (!socket) return;

        // Join rooms for any active orders so we get updates
        orders.forEach(order => {
            if (order.status !== 'Completed' && order.status !== 'Picked Up') {
                socket.emit('join_order', order._id);
            }
        });

        const handleStatusUpdate = (data) => {
            console.log("Status update received on user side:", data);
            setOrders(prevOrders =>
                prevOrders.map(o => o._id === data.orderId ? { ...o, status: data.status } : o)
            );
        };

        socket.on('order_status_update', handleStatusUpdate);

        return () => {
            socket.off('order_status_update', handleStatusUpdate);
        };
    }, [socket, orders.length]);


    if (loading) return <div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spicy"></div></div>;

    // ----- DETAILED TRACKING VIEW -----
    if (selectedOrderId) {
        const activeOrder = orders.find(o => o._id === selectedOrderId);
        if (!activeOrder) return null;

        const stages = ['Pending', 'Preparing', 'Ready', 'Picked Up'];
        let currentStageIndex = stages.indexOf(activeOrder.status);
        if (currentStageIndex === -1 || activeOrder.status === 'Completed') currentStageIndex = 4;

        return (
            <div className="min-h-screen bg-dark-bg pt-20 pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <button onClick={() => setSelectedOrderId(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} /> Back to All Orders
                    </button>

                    {/* Live Delivery Map Placeholder */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative glass-card border border-gray-800">
                        <div className="absolute inset-0 bg-[#0f1014] opacity-80" style={{ backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 bg-spicy/20 rounded-full flex items-center justify-center animate-pulse">
                                <div className="w-8 h-8 bg-spicy rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,92,0,0.5)]">
                                    <MapPin size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-dark-bg/80 backdrop-blur disabled p-3 rounded-lg border border-gray-800 text-sm text-center">
                            <p className="font-semibold text-spicy-yellow">Chator Adda Kitchen ➔ Campus Food Court</p>
                        </div>
                    </motion.div>

                    {/* Progress Timeline */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 md:p-8 rounded-2xl space-y-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-300">Order #{activeOrder._id}</span>
                            <span className="px-3 py-1 bg-dark-surface rounded-full text-xs font-bold font-mono tracking-wider text-spicy-yellow">
                                TXN: {activeOrder.transactionId}
                            </span>
                        </div>
                        <div className="w-full h-px bg-gray-800" />

                        <div className="relative">
                            <div className="absolute left-[20px] top-8 bottom-8 w-1 bg-gray-800 rounded-full z-0" />
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: currentStageIndex === 0 ? '0%' : currentStageIndex === 1 ? '33%' : currentStageIndex === 2 ? '66%' : '100%' }}
                                className="absolute left-[20px] top-8 w-1 bg-gradient-to-b from-spicy-yellow to-spicy-red rounded-full z-0"
                                transition={{ duration: 0.5 }}
                            />

                            <div className="space-y-8 relative z-10">
                                {/* Stages List */}
                                {[
                                    { icon: Clock, title: "Order Placed", desc: "We have received your order.", color: "from-yellow-400 to-yellow-600" },
                                    { icon: Flame, title: "In the Kitchen", desc: "The chef is preparing your spicy meal!", color: "from-spicy-yellow to-spicy" },
                                    { icon: CheckCircle2, title: "Ready for Pickup", desc: "It's hot and ready! Collect from counter.", color: "from-green-400 to-green-600" },
                                    { icon: Receipt, title: "Picked Up & Completed", desc: "Enjoy your food! See you next time.", color: "from-blue-400 to-blue-600" }
                                ].map((stage, idx) => (
                                    <div key={idx} className={`flex items-start gap-6 transition-opacity ${currentStageIndex >= idx ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg ${currentStageIndex >= idx ? `bg-gradient-to-br ${stage.color}` : 'bg-dark-surface border border-gray-700'}`}>
                                            <stage.icon size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white mb-0.5">{stage.title}</h3>
                                            <p className="text-sm text-gray-400">{stage.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 md:p-8 rounded-2xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Receipt size={20} className="text-gray-400" /> Order Summary</h3>
                        <ul className="space-y-4 mb-6">
                            {activeOrder.items?.map((item, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-300">
                                        <span className="text-spicy-yellow font-bold mr-3">{item.quantity}x</span>{item.menuItem?.name || 'Spicy Dish'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="h-px bg-gray-800 mb-6" />
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-gray-400">Total Paid</span>
                            <span className="text-white">₹{activeOrder.totalAmount}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ----- MAIN LIST VIEW -----
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <Receipt size={28} className="text-spicy" />
                <h1 className="text-3xl font-bold font-display">My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div className="glass-card py-16 text-center rounded-2xl border border-gray-800 flex flex-col items-center">
                    <ShoppingBag size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't ordered any spicy food yet!</p>
                    <Link to="/menu" className="bg-spicy text-white px-6 py-3 rounded-xl font-bold hover:bg-spicy-red transition-colors flex items-center gap-2">
                        Browse Menu <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence>
                        {orders.map((order, index) => (
                            <motion.div
                                onClick={() => setSelectedOrderId(order._id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={order._id}
                                className="glass-card p-6 rounded-2xl border border-gray-800 hover:border-gray-600 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group"
                            >
                                {/* Glowing border indicator for active orders */}
                                {order.status !== 'Completed' && order.status !== 'Picked Up' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-spicy-yellow" />
                                )}

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b border-gray-800 pb-4">
                                    <div>
                                        <p className="text-sm text-gray-400 font-mono mb-1">Order #{order._id.substring(0, 8)}</p>
                                        <p className="text-gray-300 flex items-center gap-2 text-sm">
                                            <Clock size={14} className="text-spicy-yellow" />
                                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${STATUS_COLORS[order.status] || STATUS_COLORS.Pending}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="text-gray-400 text-sm">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold text-white">₹{order.totalAmount}</span>
                                        <div className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center group-hover:bg-spicy transition-colors text-gray-400 group-hover:text-white">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;