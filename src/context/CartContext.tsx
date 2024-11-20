import React, {createContext, useState, useContext} from 'react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  offered_price: number;
  actual_price: number;
  quantity: number;
}

interface CartContextType {
  cart: {[id: string]: CartItem};
  addToCart: (book: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  increaseQuantity: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: any) => {
  const [cart, setCart] = useState<{[id: string]: CartItem}>({});

  const addToCart = (book: CartItem) => {
    setCart(prevCart => ({
      ...prevCart,
      [book.id]: prevCart[book.id]
        ? {...prevCart[book.id], quantity: prevCart[book.id].quantity + 1}
        : book,
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const newCart = {...prevCart};
      delete newCart[id];
      return newCart;
    });
  };

  const decreaseQuantity = (id: string) => {
    setCart((prevCart: any) => {
      const newQuantity = prevCart[id]?.quantity - 1;

      if (newQuantity <= 0) {
        const updatedCart = {...prevCart};
        delete updatedCart[id]; // Remove the item from the cart
        return updatedCart; // Return the updated cart without the removed item
      }

      return {
        ...prevCart,
        [id]: {
          ...prevCart[id],
          quantity: newQuantity,
        },
      };
    });
  };

  const increaseQuantity = (id: string) => {
    setCart(prevCart => ({
      ...prevCart,
      [id]: {
        ...prevCart[id],
        quantity: prevCart[id].quantity + 1,
      },
    }));
  };

  const clearCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
