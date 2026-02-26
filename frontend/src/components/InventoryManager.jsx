import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

const MOCK_INVENTORY = [
    { _id: '1', name: "Dragon Breath Burger", price: 149, category: "Meals", isOutofStock: false, isSpicy: true },
    { _id: '2', name: "Volcano Loaded Fries", price: 120, category: "Snacks", isOutofStock: false, isSpicy: true },
    { _id: '3', name: "Tandoori Paneer Wrap", price: 130, category: "Snacks", isOutofStock: false, isSpicy: false },
    { _id: '4', name: "Mango Tango Cooler", price: 90, category: "Beverages", isOutofStock: true, isSpicy: false }
];

const InventoryManager = () => {
    const [items, setItems] = useState(MOCK_INVENTORY);

    const toggleStock = (id) => {
        setItems(items.map(item =>
            item._id === id ? { ...item, isOutofStock: !item.isOutofStock } : item
        ));
    };

    const handleDelete = (id) => {
        setItems(items.filter(item => item._id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Inventory Control</h1>
                    <p className="text-gray-400">Manage your menu items, pricing, and availability.</p>
                </div>
                <button className="bg-spicy text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-spicy-dark transition-colors shadow-lg shadow-spicy/30">
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-surface/50 border-b border-gray-800 text-gray-400 text-sm">
                                <th className="px-6 py-4 font-semibold">Item Details</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {items.map((item) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={item._id}
                                    className={`hover:bg-dark-surface/30 transition-colors ${item.isOutofStock ? 'opacity-70' : ''}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                                                <ImageIcon size={20} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{item.name}</p>
                                                {item.isSpicy && <span className="text-xs text-spicy-red font-medium">🌶️ Spicy</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-spicy-yellow">₹{item.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value=""
                                                className="sr-only peer"
                                                checked={!item.isOutofStock}
                                                onChange={() => toggleStock(item._id)}
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                        <p className={`text-xs mt-1 font-medium ${item.isOutofStock ? 'text-red-400' : 'text-green-400'}`}>
                                            {item.isOutofStock ? 'Sold Out' : 'In Stock'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryManager;
