import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ShieldCheck, X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, totalAmount, onVerify }) => {
    const [transactionId, setTransactionId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = () => {
        if (!transactionId.trim()) {
            setError('Please enter a Transaction ID');
            return;
        }
        if (transactionId.length < 8) {
            setError('Transaction ID must be at least 8 characters');
            return;
        }

        setError('');
        setIsVerifying(true);

        // Simulate network verification delay
        setTimeout(() => {
            setIsVerifying(false);
            onVerify(transactionId);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm glass-card p-5 shadow-2xl rounded-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-display flex items-center gap-2">
                                <QrCode className="text-spicy" />
                                Secure Checkout
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-dark-bg/50 rounded-xl p-4 text-center mb-6 border border-gray-800">
                            <p className="text-gray-400 mb-2">Scan & Pay</p>
                            <div className="text-4xl font-bold text-spicy-yellow mb-6">₹{totalAmount}</div>

                            {/* Shrunk QR size from w-48 to w-40 */}
                            <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl mb-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=chatoradda@upi&pn=ChatorAdda&am=${totalAmount}&cu=INR`}
                                    alt="UPI QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-sm text-gray-400">chatoradda@upi</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Transaction ID (UTR)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter 12-digit UPI UTR Number"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                                    className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-spicy focus:ring-1 text-sm focus:ring-spicy transition-colors text-white uppercase tracking-wider"
                                />
                                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleVerify}
                                disabled={isVerifying}
                                className="w-full bg-gradient-to-r from-spicy to-spicy-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isVerifying ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Verify & Place Order
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;