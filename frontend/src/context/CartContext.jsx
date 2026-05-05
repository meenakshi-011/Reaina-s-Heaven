import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // 🛡️ Self-Healing: Fix any NaN or 0 prices from old cart items automatically
    const needsHealing = cartItems.some(item => isNaN(item.price) || item.price === undefined);
    
    if (needsHealing) {
      const cleanedItems = cartItems.map(item => ({
        ...item,
        price: Number(item.price) || Number(item.item_price) || (item.quantityOptions?.[0]?.price) || 0,
        qty: Number(item.qty) || 1,
        name: item.name || item.item_name || "Artisanal Item",
        cartItemId: item.cartItemId || item._id
      }));
      setCartItems(cleanedItems);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    // 🔍 Smart Price/Name/Image Detection
    const actualPrice = Number(
      product.price || 
      product.item_price || 
      product.selectedQty?.price || 
      (product.quantityOptions?.[0]?.price) || 
      0
    );

    const actualName = product.name || product.item_name || "Artisanal Item";
    const actualImage = product.image || product.imageurl || product.imageul || "";
    
    // Create a unique key for items with variants (like cafe sizes)
    const cartItemId = product.selectedQty?.label ? `${product._id}-${product.selectedQty.label}` : product._id;

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.cartItemId === cartItemId);

      if (existItem) {
        return prevItems.map((x) =>
          x.cartItemId === cartItemId ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        return [...prevItems, { ...product, cartItemId, name: actualName, price: actualPrice, image: actualImage, qty }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.cartItemId !== cartItemId));
  };

  const updateQty = (cartItemId, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((x) => (x.cartItemId === cartItemId ? { ...x, qty: Number(qty) } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
