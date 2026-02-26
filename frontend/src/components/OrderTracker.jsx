import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, Clock, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSocket } from '../hooks/useSocket';

const OrderTracker = () => {
    const { activeOrder, setActiveOrder } = useCart();
    const socket = useSocket();

    useEffect(() => {
        if (!socket || !activeOrder) return;

        const handleUpdate = (updatedData) => {
            // updatedData: { orderId, status }
            if (updatedData.orderId === activeOrder._id) {
                setActiveOrder(prev => ({ ...prev, status: updatedData.status }));
            }
        };

        socket.on('order_status_update', handleUpdate);

        return () => {
            socket.off('order_status_update', handleUpdate);
        };
    }, [socket, activeOrder, setActiveOrder]);

    if (!activeOrder) return null;

    const getStatusDisplay = () => {
        switch (activeOrder.status) {
            case 'Pending':
                return { icon: <Clock size={20} className="text-gray-400" />, text: 'Order Placed. Waiting for Chef...', color: 'text-gray-400' };
            case 'Preparing':
                return { icon: <Flame size={20} className="text-spicy" />, text: 'Chef is preparing your spicy meal!', color: 'text-spicy' };
            case 'Ready':
                return { icon: <CheckCircle2 size={20} className="text-green-400" />, text: 'Order is Ready! Please collect it.', color: 'text-green-400' };
            default:
                return { icon: null, text: activeOrder.status, color: '' };
        }
    };

    const { icon, text, color } = getStatusDisplay();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-40"
            >
                <div className="glass-card shadow-2xl border border-gray-700 p-4 rounded-2xl flex items-center gap-4 pr-12 relative overflow-hidden min-w-[320px]">
                    {/* Animated background gradient based on status */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-spicy-yellow to-spicy-red" />

                    <div className="w-12 h-12 bg-dark-bg rounded-xl flex items-center justify-center">
                        {icon}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-gray-400">#{activeOrder._id}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-dark-bg text-gray-300">Live</span>
                        </div>
                        <p className={`font-semibold ${color}`}>{text}</p>
                    </div>

                    <button
                        onClick={() => setActiveOrder(null)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderTracker;
