import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({
    purchases: [],
    loans: []
  });

  const addPurchaseToCart = (book, quantity) => {
    setCartItems(prev => ({
      ...prev,
      purchases: [
        ...prev.purchases,
        {
          bookId: book.id,
          quantity,
          book
        }
      ]
    }));
  };

  const addLoanToCart = (book) => {
    setCartItems(prev => ({
      ...prev,
      loans: [
        ...prev.loans,
        {
          bookId: book.id,
          book
        }
      ]
    }));
  };

  const removeFromCart = (type, bookId) => {
    setCartItems(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.bookId !== bookId)
    }));
  };

  const clearCart = () => {
    setCartItems({
      purchases: [],
      loans: []
    });
  };

  const getTotalAmount = () => {
    const purchasesTotal = cartItems.purchases.reduce(
      (sum, item) => sum + (Number(item.book.price) * item.quantity),
      0
    );

    const loansTotal = cartItems.loans.reduce(
      (sum, item) => sum + Number(item.book.rentalPrice),
      0
    );

    return (purchasesTotal + loansTotal).toFixed(2);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addPurchaseToCart,
      addLoanToCart,
      removeFromCart,
      clearCart,
      getTotalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}; 