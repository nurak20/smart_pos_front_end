import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
export const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

    // Function to update the language
    const changeLanguage = (newLanguage) => {
        localStorage.setItem("language", newLanguage); // Save to localStorage
        setLanguage(newLanguage); // Update state
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

const AppProviderContext = createContext();

export function AppProvider({ children }) {
    const [countCart, setCountCart] = useState(() => {
        try {
            const stored = Cookies.get('cart_count');
            return stored ? parseInt(stored, 10) : 0;
        } catch (e) {
            return 0
        }
    });

    // Update cookie whenever countCart changes
    useEffect(() => {
        Cookies.set('cart_count', countCart.toString(), { expires: 7 }); // store for 7 days
    }, [countCart]);

    // Action wrappers
    const increment = () => setCountCart(c => c + 1);
    const decrement = () => setCountCart(c => Math.max(0, c - 1));
    const resetCart = () => setCountCart(0);
    const refreshCard = () => {
        try {
            const cartItemsRaw = Cookies.get('cartItems');
            const cartItems = cartItemsRaw ? JSON.parse(cartItemsRaw) : [];

            // Sum all quantities
            const totalQty = Array.isArray(cartItems)
                ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
                : 0;

            setCountCart(totalQty);
        } catch (e) {
            console.error('Failed to refresh cart count:', e);
            setCountCart(0);
        }
    };
    const getCartSummary = () => {
        try {
            const cartItemsRaw = Cookies.get('cartItems');
            const cartItems = cartItemsRaw ? JSON.parse(cartItemsRaw) : [];

            let subtotal = 0;
            let totalDiscount = 0;

            if (Array.isArray(cartItems)) {
                for (const item of cartItems) {
                    const price = parseFloat(item.unitPrice || 0);
                    const qty = parseInt(item.quantity || 0, 10);
                    const discount = parseFloat(item.discountAmount || 0);

                    subtotal += price * qty;
                    totalDiscount += discount;
                }
            }

            const delivery = 3; // or conditionally set based on subtotal
            const total = subtotal - totalDiscount + delivery;

            return {
                subtotal,
                discountAmount: totalDiscount,
                delivery,
                total
            };
        } catch (e) {
            console.error('Failed to compute cart summary:', e);
            return {
                subtotal: 0,
                discountAmount: 0,
                delivery: 0,
                total: 0
            };
        }
    };

    const isLogin = () => {
        const token = Cookies.get('access_token');
        console.log(token);
        if (token) return true;
        return false;
    };




    return (
        <AppProviderContext.Provider
            value={{ countCart, increment, decrement, resetCart, refreshCard, getCartSummary, isLogin }}
        >
            {children}
        </AppProviderContext.Provider>
    );
}
export const useAppUserVerify = () => {
    const context = useContext(AppProviderContext);
    if (!context) {
        throw new Error('useAppUserVerify must be used within an AppProvider');
    }
    return context;
}

export function useCartCount() {
    const context = useContext(AppProviderContext);
    if (!context) {
        throw new Error('useCartCount must be used within an AppProvider');
    }
    return context;  // { countCart, increment, decrement, resetCart }
}