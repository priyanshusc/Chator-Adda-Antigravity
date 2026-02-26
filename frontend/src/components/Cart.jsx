import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2, IndianRupee } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSocket } from '../hooks/useSocket';
import PaymentModal from './PaymentModal';
import { useNavigate } from 'react-router-dom';

const Cart = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, setActiveOrder } = useCart();
    const socket = useSocket();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleProceedToPay = () => {
        if (cartItems.length > 0) {
            setIsPaymentModalOpen(true);
        }
    };

    const handlePaymentSuccess = async (transactionId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error("You must be logged in to place an order.");
            }

            // 1. Prepare the payload exactly how the backend expects it
            const orderPayload = {
                items: cartItems.map(item => ({
                    menuItem: item._id, // Must be the real MongoDB _id
                    quantity: item.quantity,
                    price: item.price   // The backend requires this field
                })),
                totalAmount: getCartTotal(),
                paymentMethod: 'UPI',
                transactionId: transactionId
            };

            console.log("Sending order to database:", orderPayload);

            // 2. Perform the fetch
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderPayload)
            });

            // 3. Handle non-JSON responses
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Checkout failed';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Server Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            // 4. If successful, parse the JSON
            const savedOrder = await response.json();
            console.log("Database saved your order:", savedOrder);

            // 5. Trigger WebSockets and UI changes (FIXED SECTION)
            // Save the order to React Context so the /track page knows about it
            setActiveOrder(savedOrder);

            // Tell the WebSocket server we want to listen for updates on this specific order
            if (socket) {
                socket.emit('join_order', savedOrder._id);
            }

            // 6. Cleanup and redirect
            setIsPaymentModalOpen(false);
            clearCart();
            onClose();
            navigate('/orders'); 

        } catch (err) {
            console.error("DEBUG - Full Error:", err);
            alert(`Checkout Error: ${err.message}`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Cart Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-dark-bg border-l border-gray-800 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-dark-surface/50">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-spicy-yellow" size={24} />
                                <h2 className="text-xl font-bold">Your Order</h2>
                                <span className="bg-spicy text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                    {cartItems.length}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <ShoppingBag size={64} className="opacity-20 mb-4" />
                                    <p>Your cart is empty.</p>
                                    <button onClick={onClose} className="text-spicy-yellow mt-4 hover:underline">
                                        Browse the menu
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {cartItems.map(item => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={item._id}
                                            className="glass-card p-4 flex gap-4"
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-20 h-20 rounded-xl object-cover"
                                            />
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-sm line-clamp-2 pr-2">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-gray-500 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="font-bold text-spicy-yellow">₹{item.price * item.quantity}</span>

                                                    <div className="flex items-center gap-3 bg-dark-bg py-1 px-2 rounded-lg border border-gray-700">
                                                        <button
                                                            onClick={() => updateQuantity(item._id, -1)}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, 1)}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer Summary */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-800 bg-dark-surface">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{getCartTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Taxes & Fees</span>
                                        <span>Calculate at checkout</span>
                                    </div>
                                    <div className="h-px bg-gray-800 my-2" />
                                    <div className="flex justify-between text-white text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-spicy-yellow flex items-center">
                                            <IndianRupee size={18} />
                                            {getCartTotal()}
                                        </span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleProceedToPay}
                                    className="w-full bg-gradient-to-r from-spicy to-spicy-red text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(255,92,0,0.3)] hover:shadow-[0_0_30px_rgba(255,92,0,0.5)] transition-all flex items-center justify-center gap-2"
                                >
                                    Proceed to Pay
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                totalAmount={getCartTotal()}
                onVerify={handlePaymentSuccess}
            />
        </AnimatePresence>
    );
};

export default Cart;