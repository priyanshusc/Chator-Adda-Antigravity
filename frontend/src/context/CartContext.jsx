import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. LOAD INITIAL CART ON PAGE LOAD/LOGIN
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.cart) {
            setCartItems(userInfo.cart);
        }
        setIsInitialized(true);
    }, []);

    // 2. AUTO-SYNC WITH BACKEND WHENEVER CART CHANGES
    useEffect(() => {
        if (!isInitialized) return; // Prevent wiping DB on initial load

        const syncCartToDB = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;

            try {
                // Ping the backend to save
                const response = await fetch('/api/users/cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userInfo.token}`
                    },
                    body: JSON.stringify({ cartItems })
                });

                // THE FIX: Warn us if the backend didn't accept it
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Backend refused to save cart:", errorData);
                    return; // Stop here, don't update local storage if DB failed
                }

                // If successful, update local storage
                userInfo.cart = cartItems;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

            } catch (error) {
                console.error("Network error while syncing cart:", error);
            }
        };

        // Adds a tiny 500ms delay so rapid clicking doesn't spam your server
        const debounceTimer = setTimeout(() => {
            syncCartToDB();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [cartItems, isInitialized]);

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
        setCartItems(prev => prev
            .map(i => i._id === itemId ? { ...i, quantity: i.quantity + delta } : i)
            .filter(i => i.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, activeOrder, setActiveOrder, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};