// hooks/useCart.js
import { useState, useEffect } from "react";

const CART_STORAGE_KEY = "online_marketplace_cart";

export function useCart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        try {
            const cartData = localStorage.getItem(CART_STORAGE_KEY);
            if (cartData) {
                setCart(JSON.parse(cartData));
            }
        } catch (error) {
            console.error("Failed to load cart:", error);
            setCart([]);
        }
    };

    const saveCart = (newCart) => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
            setCart(newCart);
        } catch (error) {
            console.error("Failed to save cart:", error);
        }
    };

    const addToCart = (product, quantity = 1) => {
        const existingItemIndex = cart.findIndex(
            (item) => item.productId === product._id
        );

        let newCart;
        if (existingItemIndex > -1) {
            // Update quantity if product already in cart
            newCart = [...cart];
            newCart[existingItemIndex].quantity += quantity;
        } else {
            // Add new product to cart
            const cartItem = {
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "",
                quantity: quantity,
                stock: product.stock,
            };
            newCart = [...cart, cartItem];
        }

        saveCart(newCart);
        return newCart;
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter((item) => item.productId !== productId);
        saveCart(newCart);
        return newCart;
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        const newCart = cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
        );
        saveCart(newCart);
        return newCart;
    };

    const clearCart = () => {
        localStorage.removeItem(CART_STORAGE_KEY);
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartItemsCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
    };
}
