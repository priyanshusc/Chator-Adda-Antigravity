// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Flame, CheckCircle2, Clock, MapPin, Receipt, ArrowLeft } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useSocket } from '../hooks/useSocket';

// const OrderTracker = () => {
//     const { activeOrder, setActiveOrder } = useCart();
//     const socket = useSocket();
//     const navigate = useNavigate();

//     // NEW FIX 1: Recover order from long-term memory on refresh
//     useEffect(() => {
//         if (!activeOrder) {
//             const savedOrder = localStorage.getItem('chator_active_order');
//             if (savedOrder) {
//                 setActiveOrder(JSON.parse(savedOrder));
//             }
//         }
//     }, [activeOrder, setActiveOrder]);

//     // NEW FIX 2: Save to long-term memory whenever the order updates
//     useEffect(() => {
//         if (activeOrder) {
//             localStorage.setItem('chator_active_order', JSON.stringify(activeOrder));
//         }
//     }, [activeOrder]);

//     // 1. The Flawless Real-Time Logic
//     useEffect(() => {
//         if (!socket || !activeOrder) return;

//         console.log("Student joining room for order:", activeOrder._id);
//         socket.emit('join_order', activeOrder._id);

//         const handleStatusUpdate = (data) => {
//             console.log("Student received socket data:", data);
//             if (data.orderId === activeOrder._id) {
//                 setActiveOrder(prev => ({ ...prev, status: data.status }));
//             }
//         };

//         socket.on('order_status_update', handleStatusUpdate);

//         return () => {
//             socket.off('order_status_update', handleStatusUpdate);
//         };
//     }, [socket, activeOrder, setActiveOrder]);

//     // 2. The Safe Fallback UI
//     if (!activeOrder) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 bg-dark-bg">
//                 <h2 className="text-2xl font-bold mb-4">Cooking up your data... 🍳</h2>
//                 <p className="text-gray-400 mb-6">If your order doesn't appear in a few seconds, it might have been cleared.</p>
//                 <button
//                     onClick={() => navigate('/menu')}
//                     className="bg-spicy text-white px-6 py-3 rounded-xl font-bold"
//                 >
//                     Back to Menu
//                 </button>
//             </div>
//         );
//     }

//     // 3. Stage calculation for your custom animated timeline
//     const stages = ['Pending', 'Preparing', 'Ready'];
//     const safeStatus = activeOrder.status || 'Pending';
//     let currentStageIndex = stages.indexOf(safeStatus);
//     if (currentStageIndex === -1) currentStageIndex = 0; // Fallback just in case

//     // 4. Your Original Beautiful UI Design
//     return (
//         <div className="min-h-screen bg-dark-bg pt-20 pb-12 px-4 sm:px-6">
//             <div className="max-w-3xl mx-auto space-y-6">

//                 {/* Header Navbar for Tracker */}
//                 <div className="flex items-center gap-4 mb-8">
//                     <Link to="/menu" className="p-2 bg-dark-surface rounded-full hover:bg-gray-800 transition-colors">
//                         <ArrowLeft size={20} className="text-gray-400" />
//                     </Link>
//                     <h1 className="text-2xl font-bold font-display">Live Order Tracking</h1>
//                 </div>

//                 {/* Live Delivery Map Placeholder */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative glass-card border border-gray-800"
//                 >
//                     {/* Simplified mock map visual */}
//                     <div className="absolute inset-0 bg-[#0f1014] opacity-80" style={{ backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                         <div className="w-16 h-16 bg-spicy/20 rounded-full flex items-center justify-center animate-pulse">
//                             <div className="w-8 h-8 bg-spicy rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,92,0,0.5)]">
//                                 <MapPin size={16} className="text-white" />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="absolute bottom-4 left-4 right-4 bg-dark-bg/80 backdrop-blur disabled p-3 rounded-lg border border-gray-800 text-sm text-center">
//                         <p className="font-semibold text-spicy-yellow">Chator Adda Kitchen ➔ Campus Food Court</p>
//                         <p className="text-gray-400 text-xs">Estimated wait: 10-15 mins</p>
//                     </div>
//                 </motion.div>

//                 {/* Progress Timeline */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 }}
//                     className="glass-card p-6 md:p-8 rounded-2xl space-y-8"
//                 >
//                     <div className="flex justify-between items-center mb-2">
//                         <span className="font-bold text-gray-300">Order #{activeOrder._id}</span>
//                         <span className="px-3 py-1 bg-dark-surface rounded-full text-xs font-bold font-mono tracking-wider text-spicy-yellow">
//                             TXN: {activeOrder.transactionId}
//                         </span>
//                     </div>
//                     <div className="w-full h-px bg-gray-800" />

//                     <div className="relative">
//                         {/* Connecting Line (Background track) */}
//                         <div className="absolute left-[20px] top-8 bottom-8 w-1 bg-gray-800 rounded-full z-0" />

//                         {/* Progress Line (Animated foreground fill) */}
//                         <motion.div
//                             initial={{ height: 0 }}
//                             animate={{ height: currentStageIndex === 0 ? '0%' : currentStageIndex === 1 ? '50%' : '100%' }}
//                             className="absolute left-[20px] top-8 w-1 bg-gradient-to-b from-spicy-yellow to-spicy-red rounded-full z-0"
//                             transition={{ duration: 0.5 }}
//                         />

//                         <div className="space-y-8 relative z-10">
//                             {/* Pending Stage */}
//                             <div className={`flex items-start gap-6 transition-opacity ${currentStageIndex >= 0 ? 'opacity-100' : 'opacity-40'}`}>
//                                 <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg ${currentStageIndex >= 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-dark-surface border border-gray-700'}`}>
//                                     <Clock size={20} className="text-white" />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-bold text-lg text-white mb-0.5">Order Placed</h3>
//                                     <p className="text-sm text-gray-400">We have received your order and payment.</p>
//                                 </div>
//                             </div>

//                             {/* Preparing Stage */}
//                             <div className={`flex items-start gap-6 transition-opacity ${currentStageIndex >= 1 ? 'opacity-100' : 'opacity-40'}`}>
//                                 <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg ${currentStageIndex >= 1 ? 'bg-gradient-to-br from-spicy-yellow to-spicy' : 'bg-dark-surface border border-gray-700'}`}>
//                                     <Flame size={20} className="text-white" />
//                                 </div>
//                                 <div className={currentStageIndex === 1 ? "animate-pulse" : ""}>
//                                     <h3 className="font-bold text-lg text-white mb-0.5">In the Kitchen</h3>
//                                     <p className="text-sm text-gray-400">The chef is preparing your spicy meal!</p>
//                                 </div>
//                             </div>

//                             {/* Ready Stage */}
//                             <div className={`flex items-start gap-6 transition-opacity ${currentStageIndex === 2 ? 'opacity-100' : 'opacity-40'}`}>
//                                 <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg ${currentStageIndex === 2 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-dark-surface border border-gray-700'}`}>
//                                     <CheckCircle2 size={24} className="text-white" />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-bold text-lg text-white mb-0.5">Ready for Pickup</h3>
//                                     <p className="text-sm text-gray-400">It's hot and ready! Please collect it from the counter.</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Order Summary Receipt */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="glass-card p-6 md:p-8 rounded-2xl"
//                 >
//                     <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
//                         <Receipt size={20} className="text-gray-400" />
//                         Order Summary
//                     </h3>

//                     <ul className="space-y-4 mb-6">
//                         {/* Added optional chaining (?) just in case items array isn't fully loaded immediately */}
//                         {activeOrder.items?.map((item, idx) => (
//                             <li key={idx} className="flex justify-between text-sm">
//                                 <span className="text-gray-300">
//                                     <span className="text-spicy-yellow font-bold mr-3">{item.quantity}x</span>
//                                     {item.menuItem?.name || 'Spicy Dish'}
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>

//                     <div className="h-px bg-gray-800 mb-6" />

//                     <div className="flex justify-between items-center text-lg font-bold">
//                         <span className="text-gray-400">Total Paid</span>
//                         <span className="text-white">₹{activeOrder.totalAmount}</span>
//                     </div>
//                 </motion.div>

//             </div>
//         </div>
//     );
// };

// export default OrderTracker;