import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Leaf, Loader2, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // Fetching from your real backend API
                const response = await fetch('/api/menu');
                if (!response.ok) throw new Error('Failed to fetch menu');
                const data = await response.json();
                setMenuItems(data);
            } catch (err) {
                console.error("Menu Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    if (loading) return <div className="min-h-screen pt-24 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spicy"></div></div>;

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto relative">
            <div className="absolute top-10 left-10 w-72 h-72 bg-spicy/10 rounded-full blur-[100px] -z-10" />

            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Crave.<span className="text-spicy"> Order.</span> Devour.
                </h1>
                <p className="text-gray-400 text-lg">Hottest items on campus, served fresh.</p>
            </div>

            {menuItems.length === 0 ? (
                <div className="py-20 text-center glass-card">
                    <Utensils size={48} className="mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-400">The kitchen is getting ready!</h3>
                    <p className="text-gray-500">Check back in a moment for some spicy updates.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`glass-card overflow-hidden group flex md:flex-col flex-row ${item.isOutofStock ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="relative w-40 md:w-full h-40 md:h-48 flex-shrink-0 overflow-hidden">
                                <img
                                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {item.isOutofStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg bg-red-500/80 px-4 py-2 rounded-xl border border-red-400">Sold Out</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-grow flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold group-hover:text-spicy-yellow transition-colors">{item.name}</h3>
                                    {item.isSpicy && <Flame size={18} className="text-spicy" />}
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-2xl font-bold text-white">₹{item.price}</span>
                                    <button
                                        onClick={() => !item.isOutofStock && addToCart(item)}
                                        disabled={item.isOutofStock}
                                        className={`p-3 rounded-xl transition-all ${item.isOutofStock ? 'bg-gray-700 cursor-not-allowed' : 'bg-spicy text-white hover:bg-spicy-red'}`}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;