import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

const CART_STORAGE_KEY = 'reaina_cart_items';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Hydrate cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          setCartItems(JSON.parse(saved));
        }
      } catch (err) {
        console.warn('Cart load error:', err.message);
      } finally {
        setCartLoaded(true);
      }
    };
    loadCart();
  }, []);

  // Persist cart on every change
  useEffect(() => {
    if (!cartLoaded) return;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems)).catch(
      (err) => console.warn('Cart save error:', err.message)
    );
  }, [cartItems, cartLoaded]);

  // ✅ Smart add-to-cart (mirrors web CartContext logic)
  const addToCart = (product, qty = 1) => {
    // Support both Product model (imageUrl, price) and Cafe model (imageurl, quantityOptions)
    const actualPrice = Number(
      product.price ||
        product.item_price ||
        product.selectedQty?.price ||
        product.quantityOptions?.[0]?.price ||
        0
    );

    const actualName = product.name || product.item_name || 'Artisanal Item';
    const actualImage =
      product.image ||
      product.imageUrl ||
      product.imageurl ||
      '';

    // Unique key for variants (cafe sizes)
    const cartItemId = product.selectedQty?.label
      ? `${product._id}-${product.selectedQty.label}`
      : product._id;

    setCartItems((prev) => {
      const existing = prev.find((x) => x.cartItemId === cartItemId);
      if (existing) {
        return prev.map((x) =>
          x.cartItemId === cartItemId ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartItemId,
          name: actualName,
          price: actualPrice,
          image: actualImage,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((x) => x.cartItemId !== cartItemId));
  };

  const updateQty = (cartItemId, qty) => {
    if (qty < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((x) =>
        x.cartItemId === cartItemId ? { ...x, qty: Number(qty) } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoaded,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
