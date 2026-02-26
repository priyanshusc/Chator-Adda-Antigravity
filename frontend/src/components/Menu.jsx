import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MOCK_MENU = [
    {
        _id: '1',
        name: "Dragon Breath Burger",
        description: "Crispy patty loaded with ghost pepper sauce and jalapenos.",
        price: 149,
        category: "Meals",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        isSpicy: true,
        isOutofStock: false,
        veg: false,
    },
    {
        _id: '2',
        name: "Volcano Loaded Fries",
        description: "Fries drowned in molten cheese and fiery sriracha mayo.",
        price: 120,
        category: "Snacks",
        imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=400",
        isSpicy: true,
        isOutofStock: false,
        veg: true,
    },
    {
        _id: '3',
        name: "Tandoori Paneer Wrap",
        description: "Smoky paneer with mint chutney wrapped in a flaky paratha.",
        price: 130,
        category: "Snacks",
        imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400",
        isSpicy: false,
        isOutofStock: false,
        veg: true,
    },
    {
        _id: '4',
        name: "Mango Tango Cooler",
        description: "Sweet mango blended with a hint of spicy chili powder.",
        price: 90,
        category: "Beverages",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        isSpicy: false,
        isOutofStock: true,
        veg: true,
    },
    {
        _id: '5',
        name: "Hehe",
        description: "Sweet mango blended with a hint of spicy chili powder.",
        price: 90,
        category: "Beverages",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
        isSpicy: false,
        isOutofStock: false,
        veg: true,
    }
];

const Menu = () => {
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto relative">
            <div className="absolute top-10 left-10 w-72 h-72 bg-spicy/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />

            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Crave.<span className="text-spicy"> Order.</span> Devour.
                </h1>
                <p className="text-gray-400 text-lg">Hottest items on campus, served fresh.</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 mb-8 scrollbar-hide">
                {['All', 'Snacks', 'Meals', 'Beverages'].map((cat, idx) => (
                    <button
                        key={idx}
                        className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${idx === 0 ? 'bg-spicy text-white shadow-[0_0_15px_rgba(255,92,0,0.4)]' : 'bg-dark-surface text-gray-400 hover:text-white hover:bg-dark-surface/80'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_MENU.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-card overflow-hidden group flex flex-col ${item.isOutofStock ? 'opacity-60 grayscale' : ''}`}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                                {item.isSpicy && (
                                    <span className="bg-dark-bg/80 backdrop-blur-md px-2 py-1 rounded text-spicy-light flex items-center gap-1 text-xs font-bold border border-spicy/30">
                                        <Flame size={12} className="text-spicy" /> Spicy
                                    </span>
                                )}
                                {item.veg && (
                                    <span className="bg-dark-bg/80 backdrop-blur-md px-2 py-1 rounded text-green-400 flex items-center gap-1 text-xs font-bold border border-green-500/30">
                                        <Leaf size={12} /> Veg
                                    </span>
                                )}
                            </div>
                            {item.isOutofStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg bg-red-500/80 px-4 py-2 rounded-xl backdrop-blur-sm transform -rotate-12 border border-red-400">
                                        Sold Out
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-spicy-yellow transition-colors">{item.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-2xl font-bold text-white">₹{item.price}</span>
                                <motion.button
                                    whileHover={{ scale: item.isOutofStock ? 1 : 1.1 }}
                                    whileTap={{ scale: item.isOutofStock ? 1 : 0.9 }}
                                    onClick={() => !item.isOutofStock && addToCart(item)}
                                    disabled={item.isOutofStock}
                                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${item.isOutofStock
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-spicy group-hover:bg-spicy-red shadow-lg shadow-spicy/30 text-white'
                                        }`}
                                >
                                    <Plus size={20} className={item.isOutofStock ? 'text-gray-500' : ''} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
