import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);

    const addToCart = (item) => {
        setCartItems(prev => {
            const existingItem = prev.find(i => i._id === item._id);
            if (existingItem) {
                return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(i => i._id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCartItems(prev => prev.map(i => {
            if (i._id === itemId) {
                const newQuantity = i.quantity + delta;
                return newQuantity > 0 ? { ...i, quantity: newQuantity } : i;
            }
            return i;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, activeOrder, setActiveOrder, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
