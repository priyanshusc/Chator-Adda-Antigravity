import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, Image as ImageIcon, X, Loader2 } from 'lucide-react';

const InventoryManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // NEW: Track which item is being edited. If null, we are adding a new item.
    const [editingItemId, setEditingItemId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Snacks',
        imageUrl: '',
        isSpicy: false,
        isOutofStock: false
    });

    const token = localStorage.getItem('token');

    // 1. Fetch Items from Database
    const fetchItems = async () => {
        try {
            const response = await fetch('/api/menu');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // NEW: Open modal for Adding
    const openAddModal = () => {
        setEditingItemId(null);
        setFormData({ name: '', description: '', price: '', category: 'Snacks', imageUrl: '', isSpicy: false, isOutofStock: false });
        setIsModalOpen(true);
    };

    // NEW: Open modal for Editing and pre-fill data
    const openEditModal = (item) => {
        setEditingItemId(item._id);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category,
            imageUrl: item.imageUrl || '',
            isSpicy: item.isSpicy || false,
            isOutofStock: item.isOutofStock || false
        });
        setIsModalOpen(true);
    };

    // 2. Handle Add OR Update Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingItemId ? `/api/menu/${editingItemId}` : '/api/menu';
            const method = editingItemId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const savedItem = await response.json();
                
                if (editingItemId) {
                    // Update existing item in the state array
                    setItems(items.map(item => item._id === editingItemId ? savedItem : item));
                } else {
                    // Add new item to the state array
                    setItems([...items, savedItem]);
                }
                
                setIsModalOpen(false);
                setEditingItemId(null);
            } else {
                alert(`Failed to ${editingItemId ? 'update' : 'add'} item`);
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    // 3. Toggle Stock Status (Quick Action)
    const toggleStock = async (item) => {
        try {
            const response = await fetch(`/api/menu/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isOutofStock: !item.isOutofStock })
            });
            if (response.ok) {
                setItems(items.map(i => i._id === item._id ? { ...i, isOutofStock: !i.isOutofStock } : i));
            }
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    // 4. Delete Item
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this spicy item permanently?")) return;
        try {
            const response = await fetch(`/api/menu/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setItems(items.filter(item => item._id !== id));
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-spicy" size={48} /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Inventory Control</h1>
                    <p className="text-gray-400">Manage your menu items, pricing, and availability.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-spicy text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-spicy-dark transition-colors shadow-lg shadow-spicy/30"
                >
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            {/* Modal for Adding/Editing Items */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsModalOpen(false); setEditingItemId(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative glass-card p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">{editingItemId ? 'Edit Spicy Dish' : 'Add Spicy Dish'}</h2>
                                <button onClick={() => { setIsModalOpen(false); setEditingItemId(null); }}><X /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Item Name" className="w-full bg-dark-bg p-3 rounded-lg border border-gray-800" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                <textarea placeholder="Description" className="w-full bg-dark-bg p-3 rounded-lg border border-gray-800" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                <input type="number" placeholder="Price (₹)" className="w-full bg-dark-bg p-3 rounded-lg border border-gray-800" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                <select className="w-full bg-dark-bg p-3 rounded-lg border border-gray-800 text-gray-400" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Meals">Meals</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Desserts">Desserts</option>
                                </select>
                                <input type="text" placeholder="Image URL" className="w-full bg-dark-bg p-3 rounded-lg border border-gray-800" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isSpicy} onChange={e => setFormData({ ...formData, isSpicy: e.target.checked })} /> Spicy?</label>
                                </div>
                                <button type="submit" className="w-full bg-spicy text-white py-3 rounded-xl font-bold mt-4">
                                    {editingItemId ? 'Update Item' : 'Save to Menu'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                                <tr key={item._id} className={`hover:bg-dark-surface/30 transition-colors ${item.isOutofStock ? 'opacity-70' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                                {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} /> : <ImageIcon size={20} className="text-gray-500" />}
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
                                            <input type="checkbox" className="sr-only peer" checked={!item.isOutofStock} onChange={() => toggleStock(item)} />
                                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* NEW: Edit Button */}
                                            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryManager;